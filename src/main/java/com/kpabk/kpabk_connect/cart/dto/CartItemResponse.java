package com.kpabk.kpabk_connect.cart.dto;

import com.kpabk.kpabk_connect.product.model.ProductType;
import com.kpabk.kpabk_connect.product.model.ProductUnit;
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
public class CartItemResponse {

    private Long id;
    private Long userId;
    private UUID productId;
    private String productName;
    private BigDecimal basePrice;
    private ProductType productType;
    private ProductUnit unit;
    private Integer quantity;
    private Instant addedAt;
    private Instant updatedAt;
}
