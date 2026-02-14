package com.kpabk.kpabk_connect.order.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Line item of an order. Stores product snapshot (name, price) at order time.
 * No FK to Product to avoid coupling; productId is stored for reference.
 */
@Schema(hidden = true)
@Entity
@Table(name = "order_items", indexes = {
    @Index(name = "idx_order_item_order", columnList = "order_id"),
    @Index(name = "idx_order_item_product", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "price_at_order_time", nullable = false, precision = 19, scale = 2)
    private BigDecimal priceAtOrderTime;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal subtotal;
}
