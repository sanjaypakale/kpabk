package com.kpabk.kpabk_connect.order.exception;

import java.util.UUID;

/**
 * Thrown when an order is not found by id or does not belong to the requesting principal.
 */
public class OrderNotFoundException extends RuntimeException {

    public OrderNotFoundException(UUID id) {
        super("Order not found with id: " + id);
    }

    public OrderNotFoundException(String message) {
        super(message);
    }
}
