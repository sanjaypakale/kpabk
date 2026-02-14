package com.kpabk.kpabk_connect.order.model;

/**
 * Lifecycle status of an order.
 * Stored as string in DB for H2 and PostgreSQL compatibility.
 */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PREPARING,
    READY,
    DELIVERED,
    CANCELLED
}
