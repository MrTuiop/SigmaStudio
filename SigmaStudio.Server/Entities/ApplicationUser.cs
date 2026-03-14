using Microsoft.AspNetCore.Identity;

namespace SigmaStudio.Server.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? IconPath { get; set; }
    }
}