package edu.jensen.webshopapi.repository;

import edu.jensen.webshopapi.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);

    @Query("select distinct p.category from Product p order by p.category")
    List<String> findDistinctCategories();
}

