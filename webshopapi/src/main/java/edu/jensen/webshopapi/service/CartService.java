package edu.jensen.webshopapi.service;

import edu.jensen.webshopapi.dto.*;
import edu.jensen.webshopapi.entity.Cart;
import edu.jensen.webshopapi.entity.CartItem;
import edu.jensen.webshopapi.repository.CartItemRepository;
import edu.jensen.webshopapi.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public CartResponse getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> cartRepository.save(new Cart(userId)));
        return toResponse(cart);
    }

    @Transactional
    public CartResponse addItem(Long userId, AddCartItemRequest req) {
        if (req == null || req.productId == null) throw new IllegalArgumentException("productId is required");
        int qty = (req.quantity == null) ? 1 : req.quantity;
        if (qty <= 0) throw new IllegalArgumentException("quantity must be > 0");

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> cartRepository.save(new Cart(userId)));

        CartItem item = cartItemRepository
                .findByCart_IdAndProductId(cart.getId(), req.productId)
                .orElse(null);

        if (item == null) {
            item = new CartItem(cart, req.productId, qty);
        } else {
            item.setQuantity(item.getQuantity() + qty);
        }

        cartItemRepository.save(item);
        // refresh cart view
        Cart updated = cartRepository.findByUserId(userId).orElseThrow();
        return toResponse(updated);
    }

    @Transactional
    public CartResponse updateQuantity(Long userId, Long itemId, UpdateQuantityRequest req) {
        if (req == null || req.quantity == null) throw new IllegalArgumentException("quantity is required");
        int qty = req.quantity;
        if (qty < 0) throw new IllegalArgumentException("quantity must be >= 0");

        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        // IMPORTANT: ensure the item belongs to the current user's cart
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Item does not belong to your cart");
        }

        if (qty == 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(qty);
            cartItemRepository.save(item);
        }

        Cart updated = cartRepository.findByUserId(userId).orElseThrow();
        return toResponse(updated);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Item does not belong to your cart");
        }

        cartItemRepository.delete(item);
        Cart updated = cartRepository.findByUserId(userId).orElseThrow();
        return toResponse(updated);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        cart.getItems().clear(); // orphanRemoval=true will delete rows
        cartRepository.save(cart);
    }

    private CartResponse toResponse(Cart cart) {
        CartResponse res = new CartResponse();
        res.id = cart.getId();
        res.items = cart.getItems().stream().map(ci -> {
            CartItemResponse r = new CartItemResponse();
            r.id = ci.getId();
            r.productId = ci.getProductId();
            r.quantity = ci.getQuantity();
            return r;
        }).collect(Collectors.toList());

        res.totalItems = cart.getItems().stream().mapToInt(CartItem::getQuantity).sum();
        return res;
    }
}
