package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.response.OrderResponse;
import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse checkout(User user) {
        Cart cart = cartService.getOrCreateCart(user);
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Carrinho vazio");
        }

        Order order = Order.builder()
                .user(user)
                .date(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .total(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Estoque insuficiente para: " + product.getName());
            }
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .price(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .build();
            order.getItems().add(orderItem);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }
        order.setTotal(total);
        Order saved = orderRepository.save(order);
        cartService.clearCart(cart);
        return toResponse(saved);
    }

    public List<OrderResponse> getMyOrders(User user) {
        return orderRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse r = new OrderResponse();
        r.setId(order.getId());
        r.setDate(order.getDate());
        r.setTotal(order.getTotal());
        r.setStatus(order.getStatus().name());
        r.setItems(order.getItems().stream().map(item -> {
            OrderResponse.OrderItemResponse i = new OrderResponse.OrderItemResponse();
            i.setId(item.getId());
            i.setProductId(item.getProduct().getId());
            i.setProductName(item.getProduct().getName());
            i.setPrice(item.getPrice());
            i.setQuantity(item.getQuantity());
            i.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return i;
        }).toList());
        return r;
    }
}
