using System.ComponentModel.DataAnnotations;

namespace SigmaStudio.Server.DTOs
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3, ErrorMessage = "Логин должен быть не менее 3 символов")]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Пароль должен быть не менее 6 символов")]
        public string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string ConfirmPassword { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
    }
}
