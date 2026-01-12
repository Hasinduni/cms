using IMS.Services.Models;

namespace IMS.Services.Interfaces
{
    public interface IPostService
    {
        Task<List<Post>> GetAllAsync();
        Task<Post?> GetByIdAsync(int id);
        Task<Post> CreateAsync(Post post);
        Task<Post?> UpdateAsync(int id, Post post, int userId);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
