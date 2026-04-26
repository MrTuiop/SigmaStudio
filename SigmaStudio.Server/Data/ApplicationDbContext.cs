using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SigmaStudio.Server.Entities;

namespace SigmaStudio.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUserModel>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

        public DbSet<ProjectModel> Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProjectModel>()
                .Property(p => p.TechStack)
                .HasColumnType("jsonb");

            modelBuilder.Entity<ProjectModel>()
                .Property(p => p.Screenshots)
                .HasColumnType("jsonb");

            modelBuilder.Entity<ProjectModel>()
                .Property(p => p.Sections)
                .HasColumnType("jsonb");
            modelBuilder.Entity<ProjectModel>()
                .HasIndex(p => p.Slug)
                .IsUnique();
        }
    }
}
