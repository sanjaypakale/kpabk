package com.kpabk.kpabk_connect.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {

    @NotNull(message = "Outlet ID is required")
    private Long outletId;

    /** Optional; null for guest or when not required. */
    private Long customerId;

    @Valid
    @NotNull(message = "At least one order item is required")
    @Size(min = 1, message = "At least one order item is required")
    private List<OrderItemRequest> items;
}
