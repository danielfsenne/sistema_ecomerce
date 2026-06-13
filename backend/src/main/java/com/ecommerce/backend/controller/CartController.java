package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.request.CartItemRequest;
import com.ecommerce.backend.dto.response.CartResponse;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Ver carrinho")
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/add")
    @Operation(summary = "Adicionar item ao carrinho")
    public ResponseEntity<CartResponse> addItem(@AuthenticationPrincipal User user,
                                                 @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(user, request));
    }

    @DeleteMapping("/item/{id}")
    @Operation(summary = "Remover item do carrinho")
    public ResponseEntity<CartResponse> removeItem(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(cartService.removeItem(user, id));
    }
}
