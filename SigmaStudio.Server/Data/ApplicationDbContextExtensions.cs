using Microsoft.AspNetCore.Identity;
using System.Runtime.CompilerServices;

namespace SigmaStudio.Server.Data
{
    public static class ApplicationDbContextExtensions
    {
        public static async Task InitializeRolesAsync(this IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            await RoleInitializer.InitializeAsync(roleManager);
        }
    }
}
