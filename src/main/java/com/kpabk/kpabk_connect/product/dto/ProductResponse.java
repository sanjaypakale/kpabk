package com.kpabk.kpabk_connect.product.dto;

import com.kpabk.kpabk_connect.product.model.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private UUID id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private ProductType productType;
    private UUID categoryId;
    private String categoryName;
    private String imageUrl;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
