package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.response.OrderResponse;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Finalizar compra")
    public ResponseEntity<OrderResponse> checkout(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.checkout(user));
    }

    @GetMapping
    @Operation(summary = "Histórico de pedidos")
    public ResponseEntity<List<OrderResponse>> myOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getMyOrders(user));
    }
}
