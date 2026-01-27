package edu.jensen.webshopapi.service;

import edu.jensen.webshopapi.entity.Product;
import edu.jensen.webshopapi.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product postProduct(Product product) {
        return productRepository.save(product);
    }

    public Product persistProduct(String name, String category, double price, MultipartFile image)
    throws IOException {
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = Paths.get("uploads/" + fileName);
        Files.write(path, image.getBytes());

        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        product.setImageUrl("/uploads/" + fileName);
        return productRepository.save(product);
    }
}
