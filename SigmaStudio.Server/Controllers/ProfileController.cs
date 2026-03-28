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

        public ProfileController(UserManager<ApplicationUserModel> userManager, ILogger<ProfileController> logger)
        {
            _userManager = userManager;
            _logger = logger;
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
        public async Task<ActionResult<ProfileDto>> UpdateProfileField([FromBody] UpdateProfileFieldDto updateProfileField)
        {
            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return NotFound(new { Message = "Пользователь не найден" });
            }

            if (string.IsNullOrEmpty(updateProfileField.Field))
            {
                return BadRequest(new { Message = "Поле не указано" });
            }

            try
            {
                switch (updateProfileField.Field.ToLower())
                {
                    case "username":
                        if (string.IsNullOrEmpty(updateProfileField.Value?.ToString()))
                        {
                            return BadRequest(new { Message = "Логин не может быть пустым" });
                        }

                        var existingUser = await _userManager.FindByNameAsync(updateProfileField.Value.ToString());
                        if (existingUser != null && existingUser.Id != user.Id)
                        {
                            return BadRequest(new { Message = "Этот логин уже занят" });
                        }

                        user.UserName = updateProfileField.Value.ToString();
                        break;

                    case "firstname":
                        user.FirstName = updateProfileField.Value?.ToString();
                        break;

                    case "lastname":
                        user.LastName = updateProfileField.Value?.ToString();
                        break;

                    case "email":
                        if (string.IsNullOrEmpty(updateProfileField.Value?.ToString()))
                        {
                            return BadRequest(new { Message = "Email не может быть пустым" });
                        }

                        // Проверка почты на правильность
                        if (false)
                        {
                            return BadRequest(new { Message = "Некорректный формат email" });
                        }

                        var existingEmail = await _userManager.FindByEmailAsync(updateProfileField.Value.ToString());
                        if (existingEmail != null && existingEmail.Id != user.Id)
                        { 
                            return BadRequest(new { Message = "Этот email уже занят" }); 
                        }

                        user.Email = updateProfileField.Value.ToString();
                        break;
                    case "dateofbirth":
                        if (DateOnly.TryParse(updateProfileField.Value?.ToString(), out var birthDate))
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
                        return BadRequest(new { Message = $"Поле '{updateProfileField.Field}' не поддерживается для редактирования" });
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
    }
}
