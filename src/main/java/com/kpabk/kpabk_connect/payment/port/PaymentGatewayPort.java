package com.kpabk.kpabk_connect.payment.port;


/**
 * Gateway-agnostic payment operations. Razorpay implementation provided by adapter.
 */
public interface PaymentGatewayPort {

    /**
     * Create an order at the gateway (e.g. Razorpay order).
     *
     * @param amountPaise amount in smallest unit (paise for INR)
     * @param currency    e.g. INR
     * @param receipt     optional receipt id for reference
     * @return gateway order id (e.g. razorpay order id)
     */
    String createGatewayOrder(long amountPaise, String currency, String receipt);

    /**
     * Verify webhook signature.
     *
     * @param body      raw request body
     * @param signature X-Razorpay-Signature header value
     * @return true if signature is valid
     */
    boolean verifyWebhookSignature(String body, String signature);

    /**
     * Process refund with gateway.
     *
     * @param razorpayPaymentId gateway payment id
     * @param amountPaise       amount to refund in paise (full refund if null)
     * @return gateway refund id
     */
    String createRefund(String razorpayPaymentId, Long amountPaise);
}
