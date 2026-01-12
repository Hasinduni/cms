namespace IMS.Services.DTOs
{
    // DTO for creating a post
    public record PostCreateDto(
        string Title,
        string Content,
        string? FeaturedImageUrl,
        string? Status,
        int CategoryId,
        int UserId // For test
    );

    // DTO for updating a post
    public record PostUpdateDto(
        string Title,
        string Content,
        string? FeaturedImageUrl,
        string? Status,
        int CategoryId,
        int UserId // For test
    );
}
