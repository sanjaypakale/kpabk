package com.kpabk.kpabk_connect.product.repository;

import com.kpabk.kpabk_connect.product.model.Product;
import com.kpabk.kpabk_connect.product.model.ProductType;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class ProductSpecification {

    private ProductSpecification() {}

    public static Specification<Product> withCriteria(
            String name,
            UUID categoryId,
            ProductType productType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean isActive
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (productType != null) {
                predicates.add(cb.equal(root.get("productType"), productType));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice));
            }
            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
