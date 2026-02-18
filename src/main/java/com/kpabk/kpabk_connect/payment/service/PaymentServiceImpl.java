package com.kpabk.kpabk_connect.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kpabk.kpabk_connect.payment.dto.*;
import com.kpabk.kpabk_connect.payment.exception.*;
import com.kpabk.kpabk_connect.payment.model.Payment;
import com.kpabk.kpabk_connect.payment.model.PaymentMethod;
import com.kpabk.kpabk_connect.payment.model.PaymentStatus;
import com.kpabk.kpabk_connect.payment.model.PaymentWebhookEvent;
import com.kpabk.kpabk_connect.payment.port.OrderAmountPort;
import com.kpabk.kpabk_connect.payment.port.OrderPaymentStatusPort;
import com.kpabk.kpabk_connect.payment.port.PaymentGatewayPort;
import com.kpabk.kpabk_connect.payment.repository.PaymentRepository;
import com.kpabk.kpabk_connect.payment.repository.PaymentWebhookEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentWebhookEventRepository webhookEventRepository;
    private final PaymentGatewayPort paymentGatewayPort;
    private final OrderAmountPort orderAmountPort;
    private final OrderPaymentStatusPort orderPaymentStatusPort;
    private final ObjectMapper objectMapper;

    @Value("${payment.razorpay.key-id:}")
    private String razorpayKeyId;

    @Override
    @Transactional
    public PaymentInitiationResponse createPayment(UUID orderId) {
        BigDecimal amount = orderAmountPort.getOrderAmount(orderId);
        String currency = orderAmountPort.getOrderCurrency(orderId);
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentValidationException("Order amount must be positive");
        }
        long amountPaise = amount.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).longValue();
        String receipt = "ord_" + orderId.toString().replace("-", "").substring(0, 20);

        String razorpayOrderId;
        String keyIdToReturn = razorpayKeyId;
        boolean testMode = false;

        try {
            razorpayOrderId = paymentGatewayPort.createGatewayOrder(amountPaise, currency, receipt);
        } catch (PaymentValidationException e) {
            // Fall back to test payment when gateway is not configured or auth fails (e.g. invalid keys, not onboarded)
            String msg = e.getMessage() != null ? e.getMessage() : "";
            boolean gatewayUnavailable = msg.contains("not configured")
                    || msg.contains("Authentication failed")
                    || msg.contains("BAD_REQUEST_ERROR")
                    || msg.contains("Gateway order creation failed");
            if (gatewayUnavailable) {
                testMode = true;
                razorpayOrderId = "test_order_" + orderId.toString().replace("-", "");
                keyIdToReturn = "test";
                log.info("Payment gateway unavailable (not configured or auth failed); creating test payment for order {}: {}", orderId, razorpayOrderId);
            } else {
                throw e;
            }
        }

        Payment payment = Payment.builder()
                .orderId(orderId)
                .razorpayOrderId(razorpayOrderId)
                .amount(amount)
                .currency(currency != null ? currency : "INR")
                .status(PaymentStatus.CREATED)
                .build();
        payment.setStatus(PaymentStatus.INITIATED);
        payment = paymentRepository.save(payment);

        log.info("Payment created for order {}: paymentId={}, razorpayOrderId={}, testMode={}", orderId, payment.getId(), razorpayOrderId, testMode);
        return PaymentInitiationResponse.builder()
                .paymentId(payment.getId())
                .razorpayOrderId(razorpayOrderId)
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .razorpayKeyId(keyIdToReturn)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getById(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));
        return mapToResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getByIdForCustomer(UUID paymentId, Long customerId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));
        Long orderCustomerId = orderAmountPort.getOrderCustomerId(payment.getOrderId());
        if (orderCustomerId == null || !orderCustomerId.equals(customerId)) {
            throw new PaymentNotFoundException(paymentId);
        }
        return mapToResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PaymentResponse> listPayments(int page, int size, PaymentStatus status, Instant fromDate, Instant toDate) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Payment> paymentPage;
        if (fromDate != null && toDate != null) {
            paymentPage = status != null
                    ? paymentRepository.findByStatusAndCreatedAtBetween(status, fromDate, toDate, pageable)
                    : paymentRepository.findByCreatedAtBetween(fromDate, toDate, pageable);
        } else {
            paymentPage = status != null
                    ? paymentRepository.findByStatus(status, pageable)
                    : paymentRepository.findAll(pageable);
        }
        return toPageResponse(paymentPage);
    }

    @Override
    @Transactional
    public RefundResponse refund(UUID paymentId, BigDecimal amount, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new PaymentValidationException("Only successful payments can be refunded. Current: " + payment.getStatus());
        }
        if (payment.getRazorpayPaymentId() == null || payment.getRazorpayPaymentId().isBlank()) {
            throw new PaymentValidationException("No gateway payment id for refund");
        }
        Long amountPaise = null;
        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            amountPaise = amount.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).longValue();
            if (amount.compareTo(payment.getAmount()) > 0) {
                throw new PaymentValidationException("Refund amount cannot exceed payment amount");
            }
        }
        String razorpayRefundId = paymentGatewayPort.createRefund(payment.getRazorpayPaymentId(), amountPaise);
        BigDecimal amountRefunded = amount != null && amount.compareTo(BigDecimal.ZERO) > 0
                ? amount
                : payment.getAmount();
        Instant now = Instant.now();
        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setRefundedAt(now);
        paymentRepository.save(payment);
        orderPaymentStatusPort.updateOrderPaymentStatus(payment.getOrderId(), "REFUNDED");
        log.info("Refund completed: paymentId={}, razorpayRefundId={}, amount={}", paymentId, razorpayRefundId, amountRefunded);
        return RefundResponse.builder()
                .paymentId(paymentId)
                .razorpayRefundId(razorpayRefundId)
                .amountRefunded(amountRefunded)
                .refundedAt(now)
                .build();
    }

    @Override
    @Transactional
    public boolean processWebhook(String rawBody, String signature) {
        if (!paymentGatewayPort.verifyWebhookSignature(rawBody, signature)) {
            log.warn("Webhook signature verification failed");
            throw new InvalidWebhookException("Invalid webhook signature");
        }
        JsonNode root;
        try {
            root = objectMapper.readTree(rawBody);
        } catch (Exception e) {
            log.error("Webhook body parse error: {}", e.getMessage());
            throw new InvalidWebhookException("Invalid webhook payload", e);
        }
        String eventType = Optional.ofNullable(root.get("event")).map(JsonNode::asText).orElse(null);
        if (eventType == null || eventType.isBlank()) {
            log.warn("Webhook missing event type");
            return true;
        }
        JsonNode payload = root.get("payload");
        if (payload == null) {
            log.warn("Webhook missing payload");
            return true;
        }
        String paymentId = null;
        JsonNode paymentNode = payload.get("payment");
        if (paymentNode != null && paymentNode.has("entity")) {
            JsonNode idNode = paymentNode.get("entity").get("id");
            paymentId = (idNode != null && !idNode.isNull()) ? idNode.asText() : null;
        }
        if (paymentId == null && payload.has("payment") && payload.get("payment").has("id")) {
            JsonNode idNode = payload.get("payment").get("id");
            paymentId = (idNode != null && !idNode.isNull()) ? idNode.asText() : null;
        }
        String idempotencyKey = (paymentId != null ? paymentId : root.toString().hashCode() + "_") + "_" + eventType;
        if (webhookEventRepository.existsByRazorpayEventId(idempotencyKey)) {
            log.debug("Webhook already processed (idempotent): {}", idempotencyKey);
            return true;
        }
        PaymentWebhookEvent event = PaymentWebhookEvent.builder()
                .razorpayEventId(idempotencyKey)
                .eventType(eventType)
                .rawPayload(rawBody)
                .processedAt(Instant.now())
                .build();
        webhookEventRepository.save(event);

        switch (eventType) {
            case "payment.captured" -> handlePaymentCaptured(payload, rawBody);
            case "payment.failed" -> handlePaymentFailed(payload, rawBody);
            case "refund.processed", "refund.created" -> handleRefundProcessed(payload, rawBody);
            default -> log.debug("Unhandled webhook event type: {}", eventType);
        }
        return true;
    }

    private void handlePaymentCaptured(JsonNode payload, String rawBody) {
        String razorpayPaymentId = extractPaymentId(payload);
        String razorpayOrderId = extractOrderId(payload);
        if (razorpayPaymentId == null || razorpayOrderId == null) {
            log.warn("payment.captured missing payment id or order id. Payload: {}", rawBody.substring(0, Math.min(500, rawBody.length())));
            return;
        }
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElse(null);
        if (payment == null) {
            log.warn("payment.captured: no local payment for razorpay order {}", razorpayOrderId);
            return;
        }
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            log.debug("Payment already marked SUCCESS: {}", payment.getId());
            return;
        }
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentMethod(mapMethod(extractMethod(payload)));
        paymentRepository.save(payment);
        orderPaymentStatusPort.updateOrderPaymentStatus(payment.getOrderId(), "PAID");
        log.info("Payment captured: paymentId={}, orderId={}", payment.getId(), payment.getOrderId());
    }

    private void handlePaymentFailed(JsonNode payload, String rawBody) {
        String razorpayOrderId = extractOrderId(payload);
        if (razorpayOrderId == null) {
            log.warn("payment.failed missing order id");
            return;
        }
        paymentRepository.findByRazorpayOrderId(razorpayOrderId).ifPresent(payment -> {
            if (payment.getStatus() == PaymentStatus.SUCCESS || payment.getStatus() == PaymentStatus.REFUNDED) {
                return;
            }
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            orderPaymentStatusPort.updateOrderPaymentStatus(payment.getOrderId(), "FAILED");
            log.info("Payment failed: paymentId={}, orderId={}", payment.getId(), payment.getOrderId());
        });
    }

    private void handleRefundProcessed(JsonNode payload, String rawBody) {
        JsonNode refundEntity = payload.has("refund") ? payload.get("refund").get("entity") : null;
        if (refundEntity == null) return;
        JsonNode pidNode = refundEntity.get("payment_id");
        String paymentId = (pidNode != null && !pidNode.isNull()) ? pidNode.asText() : null;
        if (paymentId == null) return;
        paymentRepository.findByRazorpayPaymentId(paymentId).ifPresent(payment -> {
            if (payment.getStatus() == PaymentStatus.REFUNDED) return;
            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setRefundedAt(Instant.now());
            paymentRepository.save(payment);
            orderPaymentStatusPort.updateOrderPaymentStatus(payment.getOrderId(), "REFUNDED");
            log.info("Refund processed: paymentId={}, orderId={}", payment.getId(), payment.getOrderId());
        });
    }

    private String extractPaymentId(JsonNode payload) {
        if (!payload.has("payment")) return null;
        JsonNode entity = payload.get("payment").get("entity");
        if (entity == null || !entity.has("id")) return null;
        JsonNode id = entity.get("id");
        return (id != null && !id.isNull()) ? id.asText() : null;
    }

    private String extractOrderId(JsonNode payload) {
        if (!payload.has("payment")) return null;
        JsonNode entity = payload.get("payment").get("entity");
        if (entity == null || !entity.has("order_id")) return null;
        JsonNode orderId = entity.get("order_id");
        return (orderId != null && !orderId.isNull()) ? orderId.asText() : null;
    }

    private String extractMethod(JsonNode payload) {
        if (!payload.has("payment")) return null;
        JsonNode entity = payload.get("payment").get("entity");
        if (entity == null || !entity.has("method")) return null;
        JsonNode method = entity.get("method");
        return (method != null && !method.isNull()) ? method.asText() : null;
    }

    private PaymentMethod mapMethod(String method) {
        if (method == null) return PaymentMethod.OTHER;
        return switch (method.toLowerCase()) {
            case "upi" -> PaymentMethod.UPI;
            case "card" -> PaymentMethod.CARD;
            case "netbanking" -> PaymentMethod.NETBANKING;
            case "wallet" -> PaymentMethod.WALLET;
            case "emi" -> PaymentMethod.EMI;
            default -> PaymentMethod.OTHER;
        };
    }

    private PaymentResponse mapToResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .orderId(p.getOrderId())
                .razorpayOrderId(p.getRazorpayOrderId())
                .razorpayPaymentId(p.getRazorpayPaymentId())
                .razorpaySignature(p.getRazorpaySignature())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .status(p.getStatus())
                .paymentMethod(p.getPaymentMethod())
                .refundedAt(p.getRefundedAt())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    private PageResponse<PaymentResponse> toPageResponse(Page<Payment> page) {
        return PageResponse.<PaymentResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
