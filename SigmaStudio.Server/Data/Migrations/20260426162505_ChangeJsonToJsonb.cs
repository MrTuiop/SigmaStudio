using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using SigmaStudio.Server.Entities;

#nullable disable

namespace SigmaStudio.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeJsonToJsonb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TechStack",
                table: "Projects",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "json");

            migrationBuilder.AlterColumn<List<ProjectSection>>(
                name: "Sections",
                table: "Projects",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(List<ProjectSection>),
                oldType: "json");

            migrationBuilder.AlterColumn<string>(
                name: "Screenshots",
                table: "Projects",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "json");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TechStack",
                table: "Projects",
                type: "json",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "jsonb");

            migrationBuilder.AlterColumn<List<ProjectSection>>(
                name: "Sections",
                table: "Projects",
                type: "json",
                nullable: false,
                oldClrType: typeof(List<ProjectSection>),
                oldType: "jsonb");

            migrationBuilder.AlterColumn<string>(
                name: "Screenshots",
                table: "Projects",
                type: "json",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "jsonb");
        }
    }
}
