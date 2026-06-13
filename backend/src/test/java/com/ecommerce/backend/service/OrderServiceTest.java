package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.response.OrderResponse;
import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository orderRepository;
    @Mock CartService cartService;
    @Mock ProductRepository productRepository;
    @InjectMocks OrderService orderService;

    @Test
    void shouldCreateOrder() {
        User user = User.builder().id(1L).name("Daniel").email("d@gmail.com").role(Role.USER).build();
        Product product = Product.builder().id(1L).name("Notebook").price(new BigDecimal("3000.00")).stock(5).build();

        CartItem item = CartItem.builder().id(1L).product(product).quantity(2).build();
        Cart cart = Cart.builder().id(1L).user(user).items(new ArrayList<>()).build();
        cart.getItems().add(item);
        item.setCart(cart);

        when(cartService.getOrCreateCart(user)).thenReturn(cart);

        Order saved = Order.builder()
                .id(1L).user(user).total(new BigDecimal("6000.00"))
                .status(OrderStatus.PENDING).items(new ArrayList<>()).build();
        OrderItem oi = OrderItem.builder().id(1L).order(saved).product(product)
                .price(new BigDecimal("3000.00")).quantity(2).build();
        saved.getItems().add(oi);

        when(orderRepository.save(any())).thenReturn(saved);
        when(productRepository.save(any())).thenReturn(product);

        OrderResponse response = orderService.checkout(user);

        assertThat(response.getTotal()).isEqualByComparingTo("6000.00");
        assertThat(response.getStatus()).isEqualTo("PENDING");
    }

    @Test
    void shouldThrowWhenCartIsEmpty() {
        User user = User.builder().id(1L).name("Daniel").email("d@gmail.com").role(Role.USER).build();
        Cart cart = Cart.builder().id(1L).user(user).items(new ArrayList<>()).build();
        when(cartService.getOrCreateCart(user)).thenReturn(cart);

        assertThatThrownBy(() -> orderService.checkout(user))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Carrinho vazio");
    }
}
