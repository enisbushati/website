package edu.jensen.webshopapi.repository;

import edu.jensen.webshopapi.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCart_IdAndProductId(Long cartId, Long productId);
}
