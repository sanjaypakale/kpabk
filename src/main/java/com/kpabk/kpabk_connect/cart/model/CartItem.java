package com.kpabk.kpabk_connect.cart.model;

import com.kpabk.kpabk_connect.auth.model.User;
import com.kpabk.kpabk_connect.product.model.Product;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;


/**
 * Cart item entity. Unique per user + product; adding the same product again increases quantity.
 */
@Schema(hidden = true)
@Entity
@Table(
    name = "cart_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"}),
    indexes = {
        @Index(name = "idx_cart_items_user", columnList = "user_id"),
        @Index(name = "idx_cart_items_product", columnList = "product_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
