package com.kpabk.kpabk_connect.payment.controller;

import com.kpabk.kpabk_connect.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Webhook endpoint for Razorpay. No authentication; verification is by signature.
 * Must be permitted in SecurityConfig.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@Hidden
public class PaymentWebhookController {

    private static final String SIGNATURE_HEADER = "X-Razorpay-Signature";

    private final PaymentService paymentService;

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestBody String rawBody,
            @RequestHeader(value = SIGNATURE_HEADER, required = false) String signature
    ) {
        log.debug("Webhook received, body length={}", rawBody != null ? rawBody.length() : 0);
        if (rawBody == null || rawBody.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (signature == null || signature.isBlank()) {
            log.warn("Webhook missing signature header");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            boolean processed = paymentService.processWebhook(rawBody, signature);
            return processed ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (com.kpabk.kpabk_connect.payment.exception.InvalidWebhookException e) {
            log.warn("Invalid webhook: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
