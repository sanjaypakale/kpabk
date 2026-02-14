package com.kpabk.kpabk_connect.payment.exception;

import java.util.UUID;

/**
 * Thrown when a payment is not found by id.
 */
public class PaymentNotFoundException extends RuntimeException {

    public PaymentNotFoundException(UUID id) {
        super("Payment not found with id: " + id);
    }

    public PaymentNotFoundException(String message) {
        super(message);
    }
}
