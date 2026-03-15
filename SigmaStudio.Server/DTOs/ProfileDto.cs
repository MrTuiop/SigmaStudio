namespace SigmaStudio.Server.DTOs
{
    public class ProfileDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string[] Roles { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? IconPath { get; set; }
    }
}
