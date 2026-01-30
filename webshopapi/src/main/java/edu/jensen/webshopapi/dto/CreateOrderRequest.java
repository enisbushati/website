package edu.jensen.webshopapi.dto;

import java.util.List;

public class CreateOrderRequest {

    private String customerName;
    private String email;
    private String address;

   private List<CreateOrderItemRequest> items;

    // Getters and Setters

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<CreateOrderItemRequest> getItems() {
    return items;
    }

public void setItems(List<CreateOrderItemRequest> items) {
    this.items = items;
    }

}
