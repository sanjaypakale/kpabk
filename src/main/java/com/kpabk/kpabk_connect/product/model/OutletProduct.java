package com.kpabk.kpabk_connect.product.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Join entity: product availability and optional pricing per outlet.
 * References Outlet by outlet_id (Long, user module) and Product (ManyToOne).
 * H2 and PostgreSQL compatible. Ready for Inventory integration (stockQuantity).
 */
@Schema(hidden = true)
@Entity
@Table(name = "outlet_products", indexes = {
    @Index(name = "idx_outlet_product_outlet", columnList = "outlet_id"),
    @Index(name = "idx_outlet_product_product", columnList = "product_id"),
    @Index(name = "idx_outlet_product_outlet_product", columnList = "outlet_id, product_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutletProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "outlet_id", nullable = false)
    private Long outletId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /**
     * Optional price override for this outlet. Null means use product.basePrice.
     */
    @Column(name = "outlet_price", precision = 19, scale = 2)
    private BigDecimal outletPrice;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    /**
     * Minimum order quantity for this product at this outlet. Default 1.
     */
    @Column(name = "minimum_order_quantity")
    @Builder.Default
    private Integer minimumOrderQuantity = 1;

    /**
     * Optional. For future integration with Inventory module.
     */
    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
