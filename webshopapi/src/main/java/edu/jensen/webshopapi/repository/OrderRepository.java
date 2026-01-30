package edu.jensen.webshopapi.repository;

import edu.jensen.webshopapi.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
