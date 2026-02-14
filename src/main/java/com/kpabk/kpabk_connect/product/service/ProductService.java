package com.kpabk.kpabk_connect.product.service;

import com.kpabk.kpabk_connect.product.dto.*;
import com.kpabk.kpabk_connect.product.exception.ResourceNotFoundException;
import com.kpabk.kpabk_connect.product.model.Category;
import com.kpabk.kpabk_connect.product.model.Product;
import com.kpabk.kpabk_connect.product.repository.CategoryRepository;
import com.kpabk.kpabk_connect.product.repository.ProductRepository;
import com.kpabk.kpabk_connect.product.repository.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.kpabk.kpabk_connect.product.service.ProductServiceUtil.trimToNull;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        Product product = mapToEntity(request, new Product(), category);
        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        return mapToResponse(product);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> search(ProductSearchCriteria criteria, Pageable pageable) {
        Specification<Product> spec = ProductSpecification.withCriteria(
                criteria.getName(),
                criteria.getCategoryId(),
                criteria.getProductType(),
                criteria.getMinPrice(),
                criteria.getMaxPrice(),
                criteria.getIsActive()
        );
        Page<Product> page = productRepository.findAll(spec, pageable);
        return PageResponse.<ProductResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    @Transactional
    public ProductResponse update(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        mapToEntity(request, product, category);
        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public void delete(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", id);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductResponse setActive(UUID id, boolean active) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        product.setIsActive(active);
        product = productRepository.save(product);
        return mapToResponse(product);
    }

    private static Product mapToEntity(ProductRequest request, Product product, Category category) {
        product.setName(request.getName().trim());
        product.setDescription(trimToNull(request.getDescription()));
        product.setBasePrice(request.getBasePrice());
        product.setProductType(request.getProductType());
        product.setCategory(category);
        product.setImageUrl(trimToNull(request.getImageUrl()));
        product.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        return product;
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .basePrice(product.getBasePrice())
                .productType(product.getProductType())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .imageUrl(product.getImageUrl())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
