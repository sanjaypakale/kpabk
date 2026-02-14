package com.kpabk.kpabk_connect.payment.repository;

import com.kpabk.kpabk_connect.payment.model.PaymentWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentWebhookEventRepository extends JpaRepository<PaymentWebhookEvent, UUID> {

    Optional<PaymentWebhookEvent> findByRazorpayEventId(String razorpayEventId);

    boolean existsByRazorpayEventId(String razorpayEventId);
}
