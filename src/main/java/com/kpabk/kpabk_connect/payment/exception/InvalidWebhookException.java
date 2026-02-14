package com.kpabk.kpabk_connect.payment.exception;

/**
 * Thrown when webhook signature is invalid or payload is malformed.
 */
public class InvalidWebhookException extends RuntimeException {

    public InvalidWebhookException(String message) {
        super(message);
    }

    public InvalidWebhookException(String message, Throwable cause) {
        super(message, cause);
    }
}
