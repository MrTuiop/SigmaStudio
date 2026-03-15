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
                IconPath = user.IconPath
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
    }
}
