package edu.jensen.webshopapi.controller;

import edu.jensen.webshopapi.dto.cart.AddCartItemRequest;
import edu.jensen.webshopapi.dto.cart.Cart;
import edu.jensen.webshopapi.dto.cart.CartItem;
import edu.jensen.webshopapi.entity.Product;
import edu.jensen.webshopapi.repository.ProductRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final ProductRepository productRepository;

    public CartController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    private Cart getOrCreateCart(HttpSession session) {
        Cart cart = (Cart) session.getAttribute("CART");
        if (cart == null) {
            cart = new Cart();
            session.setAttribute("CART", cart);
        }
        return cart;
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(HttpSession session) {
        return ResponseEntity.ok(getOrCreateCart(session));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(@RequestBody AddCartItemRequest req, HttpSession session) {
        if (req.getProductId() == null || req.getQuantity() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Cart cart = getOrCreateCart(session);

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(req.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + req.getQuantity());
        } else {
            cart.getItems().add(new CartItem(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    req.getQuantity()
            ));
        }

        session.setAttribute("CART", cart);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeItem(@PathVariable Long productId, HttpSession session) {
        Cart cart = getOrCreateCart(session);
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        session.setAttribute("CART", cart);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping
    public ResponseEntity<Cart> clearCart(HttpSession session) {
        session.removeAttribute("CART");
        return ResponseEntity.ok(new Cart());
    }
}
