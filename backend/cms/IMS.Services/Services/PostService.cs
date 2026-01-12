using IMS.Services.Data;
using IMS.Services.Interfaces;
using IMS.Services.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IMS.Services.Services
{
    public class PostService : IPostService
    {
        private readonly AppDbContext _db;
        public PostService(AppDbContext db) { _db = db; }

        public async Task<List<Post>> GetAllAsync() =>
            await _db.Posts.Include(p => p.Category).Include(p => p.User).ToListAsync();

        public async Task<Post?> GetByIdAsync(int id) =>
            await _db.Posts.Include(p => p.Category).Include(p => p.User)
                           .FirstOrDefaultAsync(p => p.Id == id);

        public async Task<Post> CreateAsync(Post post)
        {
            _db.Posts.Add(post);
            await _db.SaveChangesAsync();
            return post;
        }

        public async Task<Post?> UpdateAsync(int id, Post post, int userId)
        {
            var existing = await _db.Posts.FindAsync(id);
            if (existing == null || existing.UserId != userId) return null;

            existing.Title = post.Title;
            existing.Content = post.Content;
            existing.FeaturedImageUrl = post.FeaturedImageUrl;
            existing.Status = post.Status;
            existing.CategoryId = post.CategoryId;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var existing = await _db.Posts.FindAsync(id);
            if (existing == null || existing.UserId != userId) return false;

            _db.Posts.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
