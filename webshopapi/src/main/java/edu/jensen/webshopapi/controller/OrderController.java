package edu.jensen.webshopapi.controller;

import edu.jensen.webshopapi.dto.CreateOrderRequest;
import edu.jensen.webshopapi.entity.Order;
import edu.jensen.webshopapi.service.OrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }
}

