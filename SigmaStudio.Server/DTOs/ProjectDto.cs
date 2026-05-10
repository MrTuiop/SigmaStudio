using SigmaStudio.Server.Entities;
using System.ComponentModel.DataAnnotations;

namespace SigmaStudio.Server.DTOs
{
    public class ProjectDto
    {
        [Required] 
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        [Required]
        [RegularExpression(@"^[a-z0-9]+(-[a-z0-9]+)*$", ErrorMessage = "Slug должен содержать только строчные латинские буквы, цифры и дефисы")]
        [StringLength(100, MinimumLength = 3)]
        public string Slug { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string GithubUrl { get; set; } = string.Empty;
        public List<string> TechStack { get; set; } = new();
        public List<string> Screenshots { get; set; } = new();
        public List<ProjectSection> Sections { get; set; } = new();
    }
}
