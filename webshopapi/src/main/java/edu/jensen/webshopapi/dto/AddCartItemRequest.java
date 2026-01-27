package edu.jensen.webshopapi.dto;

public class AddCartItemRequest {

    public Long productId;
    public Integer quantity;

    public Long getProductId() { 
        return productId; 
    }

    public Integer getQuantity() { 
        return quantity; 
    }
}

