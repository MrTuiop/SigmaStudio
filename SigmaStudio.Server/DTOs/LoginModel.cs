using System.ComponentModel.DataAnnotations;

namespace SigmaStudio.Server.DTOs
{
    public class LoginModel
    {
        [Required]
        public string UserNameOrEmail { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
