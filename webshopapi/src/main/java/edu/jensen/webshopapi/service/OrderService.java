package edu.jensen.webshopapi.service;

import edu.jensen.webshopapi.dto.CreateOrderItemRequest;
import edu.jensen.webshopapi.dto.CreateOrderRequest;
import edu.jensen.webshopapi.entity.Order;
import edu.jensen.webshopapi.entity.OrderItem;
import edu.jensen.webshopapi.entity.Product;
import edu.jensen.webshopapi.repository.OrderRepository;
import edu.jensen.webshopapi.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public Order createOrder(CreateOrderRequest request) {

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setEmail(request.getEmail());
        order.setAddress(request.getAddress());

        double total = 0;

        for (CreateOrderItemRequest item : request.getItems()) {

            Product product = productRepository
                    .findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(product.getPrice());

            total += product.getPrice() * item.getQuantity();

            order.addItem(orderItem);
        }

        order.setTotalAmount(total);

        return orderRepository.save(order);
    }
}
