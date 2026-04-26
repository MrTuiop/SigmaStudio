namespace SigmaStudio.Server.Entities
{
    public class ProjectModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string GithubUrl { get; set; } = string.Empty;

        public List<string> TechStack { get; set; } = new();
        public List<string> Screenshots { get; set; } = new();
        public List<ProjectSection> Sections { get; set; } = new();
    }
}
