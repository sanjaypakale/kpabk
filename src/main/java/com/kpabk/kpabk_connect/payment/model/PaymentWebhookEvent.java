package com.kpabk.kpabk_connect.payment.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Stores processed webhook events for idempotency and audit. One event id = process once.
 */
@Schema(hidden = true)
@Entity
@Table(name = "payment_webhook_events", indexes = {
    @Index(name = "idx_webhook_razorpay_event_id", columnList = "razorpay_event_id", unique = true),
    @Index(name = "idx_webhook_processed_at", columnList = "processed_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentWebhookEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "razorpay_event_id", nullable = false, unique = true, length = 64)
    private String razorpayEventId;

    @Column(name = "event_type", nullable = false, length = 64)
    private String eventType;

    @Column(name = "raw_payload", columnDefinition = "TEXT")
    private String rawPayload;

    @Column(name = "processed_at", nullable = false)
    private Instant processedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
