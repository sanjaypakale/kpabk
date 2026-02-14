package com.kpabk.kpabk_connect.payment.port;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Port to get order details for payment. Implemented by order module / application config.
 */
public interface OrderAmountPort {

    BigDecimal getOrderAmount(UUID orderId);

    String getOrderCurrency(UUID orderId);

    /** Customer id that placed the order; null if not applicable. */
    Long getOrderCustomerId(UUID orderId);
}
