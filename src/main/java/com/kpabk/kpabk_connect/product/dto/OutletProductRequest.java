package com.kpabk.kpabk_connect.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutletProductRequest {

    @NotNull(message = "Product ID is required")
    private UUID productId;

    @DecimalMin(value = "0", inclusive = true, message = "Outlet price must be non-negative")
    private BigDecimal outletPrice;

    private Boolean isAvailable;

    @jakarta.validation.constraints.Min(value = 1, message = "Minimum order quantity must be at least 1")
    private Integer minimumOrderQuantity;

    private Integer stockQuantity;
}
