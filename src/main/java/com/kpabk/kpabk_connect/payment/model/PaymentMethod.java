package com.kpabk.kpabk_connect.payment.model;

/**
 * Payment method used at gateway. Stored as string in DB.
 */
public enum PaymentMethod {
    UPI,
    CARD,
    NETBANKING,
    WALLET,
    EMI,
    OTHER
}
