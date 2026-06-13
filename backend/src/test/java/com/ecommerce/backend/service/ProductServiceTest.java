package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.request.ProductRequest;
import com.ecommerce.backend.dto.response.ProductResponse;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock ProductRepository productRepository;
    @Mock CategoryRepository categoryRepository;
    @InjectMocks ProductService productService;

    @Test
    void shouldCreateProduct() {
        ProductRequest request = new ProductRequest();
        request.setName("Notebook");
        request.setPrice(new BigDecimal("3500.00"));
        request.setStock(10);

        Product saved = Product.builder()
                .id(1L).name("Notebook").price(new BigDecimal("3500.00")).stock(10).build();

        when(productRepository.save(any())).thenReturn(saved);

        ProductResponse response = productService.create(request);

        assertThat(response.getName()).isEqualTo("Notebook");
        assertThat(response.getPrice()).isEqualByComparingTo("3500.00");
        verify(productRepository).save(any());
    }

    @Test
    void shouldThrowWhenProductNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Produto não encontrado");
    }

    @Test
    void shouldDeleteProduct() {
        Product product = Product.builder().id(1L).name("Mouse").price(BigDecimal.TEN).stock(5).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.delete(1L);

        verify(productRepository).delete(product);
    }
}
