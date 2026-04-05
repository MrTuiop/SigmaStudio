using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SigmaStudio.Server.DTOs;
using SigmaStudio.Server.Entities;
using System.Security.Claims;

namespace SigmaStudio.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUserModel> _userManager;
        private readonly ILogger<ProfileController> _logger;
        private readonly IWebHostEnvironment _environment;

        public ProfileController(UserManager<ApplicationUserModel> userManager, ILogger<ProfileController> logger, IWebHostEnvironment environment)
        {
            _userManager = userManager;
            _logger = logger;
            _environment = environment;
        }

        [HttpGet]
        public async Task<ActionResult<ProfileDto>> GetProfile()
        {
            var user = await GetCurrentUserAsync();

            if (user == null)
            {
                return NotFound(new { Message = "Пользователь не найден" });
            }

            var roles = await _userManager.GetRolesAsync(user);

            var profile = new ProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                Roles = roles.ToArray(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth,
                AvatarUrl = user.AvatarUrl
            };

            return Ok(profile);
        }

        private async Task<ApplicationUserModel> GetCurrentUserAsync()
        {
            var userId = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            return await _userManager.FindByIdAsync(userId);
        }

        [HttpPatch("field")]
        public async Task<ActionResult<ProfileDto>> UpdateProfileField([FromBody] UpdateProfileFieldRequest request)
        {
            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return NotFound(new { Message = "Пользователь не найден" });
            }

            if (string.IsNullOrEmpty(request.Field))
            {
                return BadRequest(new { Message = "Поле не указано" });
            }

            try
            {
                switch (request.Field.ToLower())
                {
                    case "username":
                        if (string.IsNullOrEmpty(request.Value?.ToString()))
                        {
                            return BadRequest(new { Message = "Логин не может быть пустым" });
                        }

                        var existingUser = await _userManager.FindByNameAsync(request.Value.ToString());
                        if (existingUser != null && existingUser.Id != user.Id)
                        {
                            return BadRequest(new { Message = "Этот логин уже занят" });
                        }

                        user.UserName = request.Value.ToString();
                        break;

                    case "firstname":
                        user.FirstName = request.Value?.ToString();
                        break;

                    case "lastname":
                        user.LastName = request.Value?.ToString();
                        break;

                    case "email":
                        if (string.IsNullOrEmpty(request.Value?.ToString()))
                        {
                            return BadRequest(new { Message = "Email не может быть пустым" });
                        }

                        // Проверка почты на правильность
                        if (false)
                        {
                            return BadRequest(new { Message = "Некорректный формат email" });
                        }

                        var existingEmail = await _userManager.FindByEmailAsync(request.Value.ToString());
                        if (existingEmail != null && existingEmail.Id != user.Id)
                        { 
                            return BadRequest(new { Message = "Этот email уже занят" }); 
                        }

                        user.Email = request.Value.ToString();
                        break;
                    case "dateofbirth":
                        if (DateOnly.TryParse(request.Value?.ToString(), out var birthDate))
                        {
                            if (birthDate > DateOnly.FromDateTime(DateTime.Today.AddYears(-13)))
                            {
                                return BadRequest(new { Message = "Вам должно быть минимум 13 лет" });
                            }

                            user.DateOfBirth = birthDate;
                        }
                        else
                        {
                            return BadRequest(new { Message = "Некорректный формат даты" });
                        }
                        break;
                    default:
                        return BadRequest(new { Message = $"Поле '{request.Field}' не поддерживается для редактирования" });
                }

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToArray();
                    return BadRequest(new { Message = "Ошибка обновления", Errors = errors });
                }

                return await GetProfile();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка обновления поля профиля");
                return StatusCode(500, new { Message = "Внутренняя ошибка сервера" });
            }
        }

        [HttpPost("avatar")]
        public async Task<ActionResult<AvatarUploadResponse>> UploadAvatar(IFormFile file)
        {
            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return NotFound(new { Message = "Пользователь не найден" });
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest(new { Message = "Файл не выбран" });
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileExtension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new { Message = "Разрешены только изображения (JPG, PNG, GIF, WEBP" });
            }

            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { Message = "Размер файла не должен превышать 5 MB" });
            }

            try
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "avatars");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var avatarFileName = $"{user.Id}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, avatarFileName);

                if (!string.IsNullOrEmpty(user.AvatarUrl))
                {
                    var oldFileName = Path.GetFileName(user.AvatarUrl);
                    var oldFilePath = Path.Combine(uploadsFolder, oldFileName);

                    if (System.IO.File.Exists(oldFilePath) && oldFileName != avatarFileName)
                    {
                        System.IO.File.Delete(oldFilePath);
                        _logger.LogInformation("Старая аватарка удалена: {OldFile}", oldFileName);
                    }
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var avatarUrl = $"/uploads/avatars/{avatarFileName}";

                if (user.AvatarUrl != avatarUrl)
                {
                    user.AvatarUrl = avatarUrl;
                    var result = await _userManager.UpdateAsync(user);

                    if (!result.Succeeded)
                    {
                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }

                        var errors = result.Errors.Select(e => e.Description).ToArray();
                        return BadRequest(new { Message = "Ошибка сохранения аватарки", Errors = errors });
                    }
                }

                return Ok(new AvatarUploadResponse
                {
                    AvatarUrl = avatarUrl,
                    Message = "Аватарка успешно загружена"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка загрузки аватарки");
                return StatusCode(500, new { Message = "Внутренняя ошибка сервера" });
            }
        }
    }
}
