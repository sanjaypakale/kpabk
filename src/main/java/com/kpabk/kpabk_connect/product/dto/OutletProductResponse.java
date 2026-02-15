package com.kpabk.kpabk_connect.product.dto;

import com.kpabk.kpabk_connect.product.model.ProductType;
import com.kpabk.kpabk_connect.product.model.ProductUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Product view for a specific outlet, with optional outlet price and availability.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutletProductResponse {

    private Long id;
    private Long outletId;
    private UUID productId;
    private String productName;
    private String description;
    private ProductType productType;
    private ProductUnit unit;
    private BigDecimal basePrice;
    private BigDecimal outletPrice;  // null means use basePrice
    private String imageUrl;
    private Boolean isAvailable;
    private Integer minimumOrderQuantity;
    private Integer stockQuantity;
    private String categoryName;
    private Instant updatedAt;
}
