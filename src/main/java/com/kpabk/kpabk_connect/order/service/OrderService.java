package com.kpabk.kpabk_connect.order.service;

import com.kpabk.kpabk_connect.order.dto.*;
import com.kpabk.kpabk_connect.order.model.OrderStatus;
import com.kpabk.kpabk_connect.order.model.PaymentStatus;

import java.time.Instant;
import java.util.UUID;

/**
 * Order management: place order, get by id, list with filters, update status, revenue summary.
 */
public interface OrderService {

    OrderResponse placeOrder(CreateOrderRequest request);

    OrderResponse getById(UUID id);

    OrderResponse getByIdAndCustomerId(UUID id, Long customerId);

    OrderResponse getByIdAndOutletId(UUID id, Long outletId);

    PageResponse<OrderResponse> getMyOrders(Long customerId, Integer page, Integer size, OrderStatus status);

    PageResponse<OrderResponse> getOrdersByOutlet(Long outletId, Integer page, Integer size, OrderStatus status);

    OrderResponse updateStatus(UUID id, Long outletId, OrderStatus newStatus);

    /** Admin-only: update status without outlet check. */
    OrderResponse updateStatusByAdmin(UUID id, OrderStatus newStatus);

    PageResponse<OrderResponse> getAllOrders(Integer page, Integer size, OrderStatus status, Instant fromDate, Instant toDate);

    RevenueSummaryResponse getRevenueSummary(Instant fromDate, Instant toDate);

    void updatePaymentStatus(UUID orderId, PaymentStatus paymentStatus);
}
