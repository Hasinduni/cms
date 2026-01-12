using IMS.Services.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IMS.Services.Services
{
    public interface ICategoryService
    {
        Task<List<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task<Category> CreateAsync(Category category);
        Task<Category?> UpdateAsync(int id, Category category);
        Task<bool> DeleteAsync(int id);
    }
}
