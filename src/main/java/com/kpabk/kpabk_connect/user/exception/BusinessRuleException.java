package com.kpabk.kpabk_connect.user.exception;

/**
 * Thrown when a business rule is violated (e.g. OUTLET user without outlet, duplicate email).
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
