using IMS.Services.Data;
using IMS.Services.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IMS.Services.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _db;

        public CategoryService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<Category>> GetAllAsync() => await _db.Categories.ToListAsync();

        public async Task<Category?> GetByIdAsync(int id) => await _db.Categories.FindAsync(id);

        public async Task<Category> CreateAsync(Category category)
        {
            _db.Categories.Add(category);
            await _db.SaveChangesAsync();
            return category;
        }

        public async Task<Category?> UpdateAsync(int id, Category category)
        {
            var existing = await _db.Categories.FindAsync(id);
            if (existing == null) return null;
            existing.Name = category.Name;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _db.Categories.FindAsync(id);
            if (existing == null) return false;
            _db.Categories.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
