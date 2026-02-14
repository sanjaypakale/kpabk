package com.kpabk.kpabk_connect.payment.repository;

import com.kpabk.kpabk_connect.payment.model.Payment;
import com.kpabk.kpabk_connect.payment.model.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    Page<Payment> findByOrderId(UUID orderId, Pageable pageable);

    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.createdAt >= :from AND p.createdAt <= :to")
    Page<Payment> findByStatusAndCreatedAtBetween(
            @Param("status") PaymentStatus status,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE p.createdAt >= :from AND p.createdAt <= :to")
    Page<Payment> findByCreatedAtBetween(
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable);
}
