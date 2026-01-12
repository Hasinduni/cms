using Microsoft.EntityFrameworkCore;
using IMS.Services.Models;

namespace IMS.Services.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Post> Posts { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
    }
}
