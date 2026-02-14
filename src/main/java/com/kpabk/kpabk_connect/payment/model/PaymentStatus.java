package com.kpabk.kpabk_connect.payment.model;

/**
 * Payment lifecycle status. Stored as string in DB for H2 and PostgreSQL compatibility.
 */
public enum PaymentStatus {
    CREATED,
    INITIATED,
    SUCCESS,
    FAILED,
    REFUNDED
}
