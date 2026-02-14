package com.kpabk.kpabk_connect.order.exception;

/**
 * Thrown when an order state transition is not allowed (e.g. cancelling a delivered order).
 */
public class InvalidOrderStateException extends RuntimeException {

    public InvalidOrderStateException(String message) {
        super(message);
    }
}
