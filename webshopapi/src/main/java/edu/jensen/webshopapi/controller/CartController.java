package edu.jensen.webshopapi.controller;

import edu.jensen.webshopapi.dto.*;
import edu.jensen.webshopapi.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.0.212:3000"})
@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Change this method to match your auth/user setup
    private Long getUserId(Principal principal) {
    return 1L;   // TEMPORARY: always user id = 1
    }


    @GetMapping
    public CartResponse getCart(Principal principal) {
        return cartService.getCart(getUserId(principal));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(Principal principal, @RequestBody AddCartItemRequest req) {
        return ResponseEntity.ok(cartService.addItem(getUserId(principal), req));
    }

    @PatchMapping("/items/{itemId}")
    public CartResponse updateQty(Principal principal, @PathVariable Long itemId, @RequestBody UpdateQuantityRequest req) {
        return cartService.updateQuantity(getUserId(principal), itemId, req);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(Principal principal, @PathVariable Long itemId) {
        return cartService.removeItem(getUserId(principal), itemId);
    }

    @DeleteMapping
    public ResponseEntity<Void> clear(Principal principal) {
        cartService.clearCart(getUserId(principal));
        return ResponseEntity.noContent().build();
    }
}
