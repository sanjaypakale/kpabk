package com.kpabk.kpabk_connect.payment.service;

import com.kpabk.kpabk_connect.payment.dto.*;
import com.kpabk.kpabk_connect.payment.model.PaymentStatus;

import java.time.Instant;
import java.util.UUID;

/**
 * Payment initiation, retrieval, refund, and webhook processing.
 */
public interface PaymentService {

    /**
     * Create payment for an order: create record and gateway order, return details for frontend.
     */
    PaymentInitiationResponse createPayment(UUID orderId);

    /**
     * Get payment by id. Caller must ensure authorization (customer/admin).
     */
    PaymentResponse getById(UUID paymentId);

    /**
     * Get payment by id and customer's order (for CUSTOMER role).
     */
    PaymentResponse getByIdForCustomer(UUID paymentId, Long customerId);

    /**
     * Admin: list payments with optional status and date filter.
     */
    PageResponse<PaymentResponse> listPayments(int page, int size, PaymentStatus status, Instant fromDate, Instant toDate);

    /**
     * Admin: initiate refund. Updates payment status and order payment status.
     */
    RefundResponse refund(UUID paymentId, java.math.BigDecimal amount, String reason);

    /**
     * Webhook: verify signature, ensure idempotency, process event, update payment and order.
     * Returns true if processed (or already processed), false if signature invalid or event ignored.
     */
    boolean processWebhook(String rawBody, String signature);
}
