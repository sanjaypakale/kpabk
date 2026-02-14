package com.kpabk.kpabk_connect.product.service;

import com.kpabk.kpabk_connect.product.dto.CategoryRequest;
import com.kpabk.kpabk_connect.product.dto.CategoryResponse;
import com.kpabk.kpabk_connect.product.exception.BusinessException;
import com.kpabk.kpabk_connect.product.exception.ResourceNotFoundException;
import com.kpabk.kpabk_connect.product.model.Category;
import com.kpabk.kpabk_connect.product.repository.CategoryRepository;
import com.kpabk.kpabk_connect.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.kpabk.kpabk_connect.product.service.ProductServiceUtil.trimToNull;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category category = mapToEntity(request, new Category());
        category = categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Transactional(readOnly = true)
    public CategoryResponse getById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        return mapToResponse(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAll(Boolean activeOnly) {
        List<Category> list = activeOnly != null && activeOnly
                ? categoryRepository.findByIsActiveTrueOrderByNameAsc()
                : categoryRepository.findAll(Sort.by("name"));
        return list.stream().map(CategoryService::mapToResponse).toList();
    }

    @Transactional
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        mapToEntity(request, category);
        category = categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Transactional
    public void delete(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        long productCount = productRepository.countByCategory_Id(id);
        if (productCount > 0) {
            throw new BusinessException("Cannot delete category with existing products. Remove or reassign products first.");
        }
        categoryRepository.delete(category);
    }

    private static Category mapToEntity(CategoryRequest request, Category category) {
        category.setName(request.getName().trim());
        category.setDescription(trimToNull(request.getDescription()));
        category.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        return category;
    }

    private static CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .isActive(category.getIsActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
