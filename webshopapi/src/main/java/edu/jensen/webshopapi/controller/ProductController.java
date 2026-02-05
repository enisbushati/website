package edu.jensen.webshopapi.controller;

import edu.jensen.webshopapi.dto.ProductDto;
import edu.jensen.webshopapi.entity.Product;
import edu.jensen.webshopapi.service.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.0.212:3000"})
@RestController
@RequestMapping("/products")

public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET all products
    @GetMapping
    public List<ProductDto> getAllProducts() {
        return productService.getAllProducts()
                .stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }
    // GET products by category
    @GetMapping("/category/{category}")
    public List<ProductDto> getProductsByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category)
                .stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }
    // GET all categories
    @GetMapping("/categories")
    public List<String> getCategories() {
        return productService.getCategories();
    }



    // POST product WITH image
    //@PostMapping(consumes = "multipart/form-data")
    public ProductDto postProduct(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam double price,
            @RequestParam MultipartFile image
    ) throws IOException {

        // Save image
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = Paths.get("uploads/" + fileName);
        Files.write(path, image.getBytes());

        // Create product
        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        product.setImageUrl("/uploads/" + fileName);

        // Save via service
        Product saved = productService.postProduct(product);

        return ProductDto.fromEntity(saved);
    }

    @PostMapping(consumes = "multipart/form-data")
    public ProductDto postProduct1(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam double price,
            @RequestParam MultipartFile image
    ) throws IOException {
        Product saved = productService.persistProduct(name,category,price,image);
        return ProductDto.fromEntity(saved);
    }
}
