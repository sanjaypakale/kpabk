package com.kpabk.kpabk_connect.payment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundRequest {

    @NotNull(message = "Payment ID is required")
    private UUID paymentId;

    /** Optional partial refund amount. If null, full refund. */
    private BigDecimal amount;

    /** Optional reason for audit. */
    private String reason;
}
