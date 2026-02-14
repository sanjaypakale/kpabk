package com.kpabk.kpabk_connect.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundResponse {

    private UUID paymentId;
    private String razorpayRefundId;
    private BigDecimal amountRefunded;
    private Instant refundedAt;
}
