package com.kpabk.kpabk_connect.product.dto;

import com.kpabk.kpabk_connect.product.model.ProductType;
import com.kpabk.kpabk_connect.product.model.ProductUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Search/filter criteria for product listing.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchCriteria {

    private String name;           // partial match
    private UUID categoryId;
    private ProductType productType;
    private ProductUnit unit;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean isActive;      // null = all, true/false = filter
}
