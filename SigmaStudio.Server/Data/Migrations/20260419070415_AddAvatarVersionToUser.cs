using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SigmaStudio.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarVersionToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "AvatarVersion",
                table: "AspNetUsers",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarVersion",
                table: "AspNetUsers");
        }
    }
}
