using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SigmaStudio.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameIconPathToAvatarUrlInApplicationUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IconPath",
                table: "AspNetUsers",
                newName: "AvatarUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AvatarUrl",
                table: "AspNetUsers",
                newName: "IconPath");
        }
    }
}
