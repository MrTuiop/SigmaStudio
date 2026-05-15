using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SigmaStudio.Server.Data;
using SigmaStudio.Server.DTOs;
using SigmaStudio.Server.Entities;

namespace SigmaStudio.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProfileController> _logger;
        private readonly IWebHostEnvironment _environment;

        public ProjectsController(ApplicationDbContext context, ILogger<ProfileController> logger, IWebHostEnvironment environment)
        {
            _context = context;
            _logger = logger;
            _environment = environment;
        }

        [HttpPut("{slug}")]
        public async Task<IActionResult> Update(string slug, [FromBody] ProjectDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Slug == slug);
            if (project == null) return NotFound(new { message = "Проект не найден" });

            if (dto.Slug != slug)
            {
                var exists = await _context.Projects.AnyAsync(p => p.Slug == dto.Slug && p.Id != project.Id);
                if (exists) return Conflict(new { message = $"Проект с адресом '/projects/{dto.Slug}' уже существует" });
            }

            // Обновляем только разрешённые поля
            project.Title = dto.Title;
            project.Description = dto.Description;
            project.Slug = dto.Slug;
            project.ImageUrl = dto.ImageUrl;
            project.GithubUrl = dto.GithubUrl;
            project.TechStack = dto.TechStack ?? new();
            project.Screenshots = dto.Screenshots ?? new();
            project.Sections = dto.Sections ?? new();

            await _context.SaveChangesAsync();
            return Ok(project);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                return BadRequest(new { message = "Slug не может быть пустым" });

            var project = await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Slug == slug.ToLower());

            if (project == null)
                return NotFound(new { message = "Проект не найден" });

            return Ok(project);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();

            return Ok(project);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _context.Projects
                .AsNoTracking()
                .ToListAsync();

            return Ok(projects);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProjectDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Проверка уникальности slug
            if (await _context.Projects.AnyAsync(p => p.Slug == dto.Slug))
                return Conflict(new { message = $"Проект с адресом '/projects/{dto.Slug}' уже существует" });

            var project = new ProjectModel
            {
                Title = dto.Title,
                Slug = dto.Slug,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                GithubUrl = dto.GithubUrl,
                TechStack = dto.TechStack ?? new(),
                Screenshots = dto.Screenshots ?? new(),
                Sections = dto.Sections ?? new()
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBySlug), new { slug = project.Slug }, project);
        }

        // Добавление проекта project.Slug = model.Title.ToLower().Replace(" ", "-");


    }
}
