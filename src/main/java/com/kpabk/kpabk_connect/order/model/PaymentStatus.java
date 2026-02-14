package com.kpabk.kpabk_connect.order.model;

/**
 * Payment state for an order.
 * Stored as string in DB for H2 and PostgreSQL compatibility.
 */
public enum PaymentStatus {
    UNPAID,
    PAID,
    FAILED,
    REFUNDED
}
