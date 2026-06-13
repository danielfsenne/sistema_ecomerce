package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.request.ProductRequest;
import com.ecommerce.backend.dto.response.ProductResponse;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> findAll(String name, Long categoryId, Pageable pageable) {
        Page<Product> page;
        if (name != null && categoryId != null) {
            page = productRepository.findByNameContainingIgnoreCaseAndCategoryId(name, categoryId, pageable);
        } else if (name != null) {
            page = productRepository.findByNameContainingIgnoreCase(name, pageable);
        } else if (categoryId != null) {
            page = productRepository.findByCategoryId(categoryId, pageable);
        } else {
            page = productRepository.findAll(pageable);
        }
        return page.map(this::toResponse);
    }

    public ProductResponse findById(Long id) {
        return toResponse(getProduct(id));
    }

    public ProductResponse create(ProductRequest request) {
        Product product = buildProduct(new Product(), request);
        return toResponse(productRepository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = buildProduct(getProduct(id), request);
        return toResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        productRepository.delete(getProduct(id));
    }

    public void updateImageUrl(Long id, String imageUrl) {
        Product product = getProduct(id);
        product.setImageUrl(imageUrl);
        productRepository.save(product);
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
    }

    private Product buildProduct(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
            product.setCategory(category);
        }
        return product;
    }

    public ProductResponse toResponse(Product p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setPrice(p.getPrice());
        r.setImageUrl(p.getImageUrl());
        r.setStock(p.getStock());
        if (p.getCategory() != null) {
            r.setCategoryId(p.getCategory().getId());
            r.setCategoryName(p.getCategory().getName());
        }
        return r;
    }
}
