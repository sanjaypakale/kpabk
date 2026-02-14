package com.kpabk.kpabk_connect.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueSummaryResponse {

    private Instant fromDate;
    private Instant toDate;
    private BigDecimal totalRevenue;
    private long orderCount;
}
