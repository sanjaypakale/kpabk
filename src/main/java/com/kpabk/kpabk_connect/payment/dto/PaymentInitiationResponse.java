package com.kpabk.kpabk_connect.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Response after creating a payment: frontend uses these to open Razorpay checkout.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiationResponse {

    private UUID paymentId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    /** Razorpay key ID for client-side checkout. */
    private String razorpayKeyId;
}
