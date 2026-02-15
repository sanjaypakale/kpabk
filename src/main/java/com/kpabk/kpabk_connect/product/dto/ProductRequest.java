package com.kpabk.kpabk_connect.product.dto;

import com.kpabk.kpabk_connect.product.model.ProductType;
import com.kpabk.kpabk_connect.product.model.ProductUnit;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 255)
    private String name;

    @Size(max = 1000)
    private String description;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0", inclusive = true, message = "Base price must be non-negative")
    private BigDecimal basePrice;

    @NotNull(message = "Product type is required")
    private ProductType productType;

    @NotNull(message = "Unit is required (e.g. PAC, KGS, SET, PCS)")
    private ProductUnit unit;

    @NotNull(message = "Category is required")
    private UUID categoryId;

    @Size(max = 512)
    private String imageUrl;

    private Boolean isActive;
}
