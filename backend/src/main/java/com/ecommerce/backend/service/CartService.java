package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.request.CartItemRequest;
import com.ecommerce.backend.dto.response.CartResponse;
import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    public CartResponse getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return toResponse(cart);
    }

    @Transactional
    public CartResponse addItem(User user, CartItemRequest request) {
        Cart cart = getOrCreateCart(user);
        Product product = productService.getProduct(request.getProductId());

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Estoque insuficiente");
        }

        Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty = item.getQuantity() + request.getQuantity();
            if (product.getStock() < newQty) {
                throw new BadRequestException("Estoque insuficiente");
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
        }
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(User user, Long itemId) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado"));
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item não pertence ao carrinho");
        }
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toResponse(cart);
    }

    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private CartResponse toResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setItems(cart.getItems().stream().map(item -> {
            CartResponse.CartItemResponse r = new CartResponse.CartItemResponse();
            r.setId(item.getId());
            r.setProductId(item.getProduct().getId());
            r.setProductName(item.getProduct().getName());
            r.setProductImageUrl(item.getProduct().getImageUrl());
            r.setProductPrice(item.getProduct().getPrice());
            r.setQuantity(item.getQuantity());
            r.setSubtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return r;
        }).toList());
        response.setTotal(response.getItems().stream()
                .map(CartResponse.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        return response;
    }
}
