package com.kpabk.kpabk_connect.payment.service;

import com.kpabk.kpabk_connect.payment.config.RazorpayProperties;
import com.kpabk.kpabk_connect.payment.port.PaymentGatewayPort;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Refund;
import com.razorpay.Utils;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

/**
 * Razorpay implementation of PaymentGatewayPort. Active only when payment.razorpay.key-id is set and non-empty.
 * When active, this bean is @Primary so it is injected instead of NoOpPaymentGatewayAdapter.
 * Constructor never throws so context can start; invalid config is detected on first use.
 */
@Component
@ConditionalOnExpression("!'${payment.razorpay.key-id:}'.isEmpty()")
@Primary
@Slf4j
public class RazorpayPaymentGatewayAdapter implements PaymentGatewayPort {

    private final RazorpayClient razorpayClient;
    private final String webhookSecret;

    public RazorpayPaymentGatewayAdapter(RazorpayProperties properties) {
        RazorpayClient client = null;
        String secret = null;
        try {
            client = new RazorpayClient(properties.getKeyId(), properties.getKeySecret());
            secret = properties.getWebhookSecret();
        } catch (RazorpayException e) {
            log.warn("Razorpay client not initialized (payment.razorpay.key-id/secret invalid): {}", e.getMessage());
        }
        this.razorpayClient = client;
        this.webhookSecret = secret;
    }

    @Override
    public String createGatewayOrder(long amountPaise, String currency, String receipt) {
        if (razorpayClient == null) {
            throw new com.kpabk.kpabk_connect.payment.exception.PaymentValidationException(
                    "Razorpay is not configured. Set payment.razorpay.key-id and key-secret.");
        }
        try {
            JSONObject request = new JSONObject();
            request.put("amount", amountPaise);
            request.put("currency", currency);
            request.put("receipt", receipt != null ? receipt : "rcpt_" + System.currentTimeMillis());
            Order order = razorpayClient.orders.create(request);
            String orderId = order.get("id");
            log.debug("Razorpay order created: {}", orderId);
            return orderId;
        } catch (RazorpayException e) {
            log.error("Razorpay order creation failed: {}", e.getMessage());
            throw new com.kpabk.kpabk_connect.payment.exception.PaymentValidationException(
                    "Gateway order creation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean verifyWebhookSignature(String body, String signature) {
        if (body == null || signature == null || webhookSecret == null || webhookSecret.isBlank()) {
            return false;
        }
        try {
            return Utils.verifyWebhookSignature(body, signature, webhookSecret);
        } catch (RazorpayException e) {
            log.warn("Webhook signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public String createRefund(String razorpayPaymentId, Long amountPaise) {
        if (razorpayClient == null) {
            throw new com.kpabk.kpabk_connect.payment.exception.PaymentValidationException(
                    "Razorpay is not configured. Set payment.razorpay.key-id and key-secret.");
        }
        try {
            JSONObject request = new JSONObject();
            if (amountPaise != null && amountPaise > 0) {
                request.put("amount", amountPaise);
            }
            Refund refund = razorpayClient.payments.refund(razorpayPaymentId, request.has("amount") ? request : null);
            String refundId = refund.get("id");
            log.info("Razorpay refund created: {} for payment {}", refundId, razorpayPaymentId);
            return refundId;
        } catch (RazorpayException e) {
            log.error("Razorpay refund failed for payment {}: {}", razorpayPaymentId, e.getMessage());
            throw new com.kpabk.kpabk_connect.payment.exception.PaymentValidationException(
                    "Refund failed: " + e.getMessage(), e);
        }
    }
}
