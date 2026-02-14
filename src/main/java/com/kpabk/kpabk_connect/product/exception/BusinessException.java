package com.kpabk.kpabk_connect.product.exception;

/**
 * Thrown when a business rule is violated (e.g. delete category with products).
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
