using IMS.Services.Models;
using IMS.Services.Services;
using IMS.Services.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IMS.Services.Controllers;

[Authorize] // Require JWT for all actions
[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly PostService _service;

    public PostController(PostService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var post = await _service.GetByIdAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PostCreateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("Invalid token");

        var post = new Post
        {
            Title = dto.Title,
            Content = dto.Content,
            FeaturedImageUrl = dto.FeaturedImageUrl,
            Status = dto.Status ?? "Draft",
            CategoryId = dto.CategoryId,
            UserId = int.Parse(userIdClaim),
            CreatedAt = DateTime.UtcNow
        };

        var created = await _service.CreateAsync(post);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PostUpdateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("Invalid token");

        var post = new Post
        {
            Title = dto.Title,
            Content = dto.Content,
            FeaturedImageUrl = dto.FeaturedImageUrl,
            Status = dto.Status,
            CategoryId = dto.CategoryId
        };

        var updated = await _service.UpdateAsync(id, post, int.Parse(userIdClaim));
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("Invalid token");

        var deleted = await _service.DeleteAsync(id, int.Parse(userIdClaim));
        if (!deleted) return NotFound();
        return NoContent();
    }
}
