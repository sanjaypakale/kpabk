package com.kpabk.kpabk_connect.payment.port;

import java.util.UUID;

/**
 * Port to update order payment status. Implemented by order module / application config.
 * Keeps payment module decoupled from order entity.
 */
public interface OrderPaymentStatusPort {

    /**
     * @param orderId      order to update
     * @param paymentStatus one of PAID, FAILED, REFUNDED (order module's PaymentStatus)
     */
    void updateOrderPaymentStatus(UUID orderId, String paymentStatus);
}
