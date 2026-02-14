package com.kpabk.kpabk_connect.user.exception;

/**
 * Thrown when a requested resource (e.g. Outlet, User) is not found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " not found with id: " + id);
    }
}
