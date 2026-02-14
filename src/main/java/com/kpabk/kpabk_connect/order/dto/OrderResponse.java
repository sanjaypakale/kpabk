package com.kpabk.kpabk_connect.order.dto;

import com.kpabk.kpabk_connect.order.model.OrderStatus;
import com.kpabk.kpabk_connect.order.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private UUID id;
    private String orderNumber;
    private Long outletId;
    private Long customerId;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private Instant createdAt;
    private Instant updatedAt;
    private List<OrderItemResponse> items;
}
