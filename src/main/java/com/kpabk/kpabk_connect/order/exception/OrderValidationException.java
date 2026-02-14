package com.kpabk.kpabk_connect.order.exception;

/**
 * Thrown when order placement validation fails (outlet inactive, product unavailable, quantity rules).
 */
public class OrderValidationException extends RuntimeException {

    public OrderValidationException(String message) {
        super(message);
    }
}
