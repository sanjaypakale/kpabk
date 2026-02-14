package com.kpabk.kpabk_connect.payment.exception;

/**
 * Thrown when payment operation is invalid (e.g. order not found, already paid, refund not allowed).
 */
public class PaymentValidationException extends RuntimeException {

    public PaymentValidationException(String message) {
        super(message);
    }

    public PaymentValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
