package edu.jensen.webshopapi.dto;

import edu.jensen.webshopapi.entity.Product;

public class ProductDto {
    private Long id;
    private String name;
    private String category;
    private Double price;
    private String imageUrl;

    // Default constructor
    public ProductDto() {}

    // Full constructor
    public ProductDto(Long id, String name, String category, Double price, String imageUrl) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    // Convert Product entity → ProductDto
    public static ProductDto fromEntity(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getPrice(),
                product.getImageUrl()
        );
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
