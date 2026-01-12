using Microsoft.AspNetCore.Mvc;
using IMS.Services.Models;
using IMS.Services.Services;
using Microsoft.AspNetCore.Authorization;

namespace IMS.Services.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;
        public CategoryController(ICategoryService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var cat = await _service.GetByIdAsync(id);
            if (cat == null) return NotFound();
            return Ok(cat);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Category category)
        {
            var created = await _service.CreateAsync(category);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Category category)
        {
            var updated = await _service.UpdateAsync(id, category);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
