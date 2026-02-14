package com.kpabk.kpabk_connect.payment.service;

import com.kpabk.kpabk_connect.payment.port.PaymentGatewayPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Default payment gateway when Razorpay is not configured. Throws on create/refund, returns false on verify.
 * When Razorpay is enabled (payment.razorpay.key-id set), RazorpayPaymentGatewayAdapter is @Primary and is used instead.
 */
@Component
@Slf4j
public class NoOpPaymentGatewayAdapter implements PaymentGatewayPort {

    @Override
    public String createGatewayOrder(long amountPaise, String currency, String receipt) {
        throw new com.kpabk.kpabk_connect.payment.exception.PaymentValidationException(
                "Payment gateway not configured. Set payment.razorpay.key-id and key-secret.");
    }

    @Override
    public boolean verifyWebhookSignature(String body, String signature) {
        return false;
    }

    @Override
    public String createRefund(String razorpayPaymentId, Long amountPaise) {
        throw new com.kpabk.kpabk_connect.payment.exception.PaymentValidationException(
                "Payment gateway not configured. Set payment.razorpay.key-id and key-secret.");
    }
}
