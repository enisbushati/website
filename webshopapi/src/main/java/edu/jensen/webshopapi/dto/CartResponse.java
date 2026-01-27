package edu.jensen.webshopapi.dto;

import java.util.List;

public class CartResponse {
    public Long id;
    public List<CartItemResponse> items;
    public int totalItems; // sum of quantities
}
