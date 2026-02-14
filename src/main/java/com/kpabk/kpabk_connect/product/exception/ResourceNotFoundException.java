package com.kpabk.kpabk_connect.product.exception;

/**
 * Thrown when a requested resource (Product, Category, OutletProduct) is not found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " not found: " + id);
    }
}
