package com.kpabk.kpabk_connect.payment.exception;

import java.util.UUID;

/**
 * Thrown by OrderAmountPort adapter when order does not exist (keeps payment module decoupled from order).
 */
public class OrderNotFoundForPaymentException extends RuntimeException {

    public OrderNotFoundForPaymentException(UUID orderId) {
        super("Order not found for payment: " + orderId);
    }
}
