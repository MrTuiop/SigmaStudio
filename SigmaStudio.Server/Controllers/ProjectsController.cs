using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SigmaStudio.Server.Data;
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _context.Projects
                .AsNoTracking()
                .ToListAsync();

            return Ok(projects);
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

        // Добавление проекта project.Slug = model.Title.ToLower().Replace(" ", "-");
    }
}
