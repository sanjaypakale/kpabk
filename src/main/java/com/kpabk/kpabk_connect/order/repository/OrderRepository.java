package com.kpabk.kpabk_connect.order.repository;

import com.kpabk.kpabk_connect.order.model.Order;
import com.kpabk.kpabk_connect.order.model.OrderStatus;
import com.kpabk.kpabk_connect.order.model.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);

    Page<Order> findByOutletId(Long outletId, Pageable pageable);

    Page<Order> findByOutletIdAndStatus(Long outletId, OrderStatus status, Pageable pageable);

    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    Page<Order> findByCustomerIdAndStatus(Long customerId, OrderStatus status, Pageable pageable);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :from AND o.createdAt <= :to")
    Page<Order> findByCreatedAtBetween(@Param("from") Instant from, @Param("to") Instant to, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :from AND o.createdAt <= :to AND o.status = :status")
    Page<Order> findByCreatedAtBetweenAndStatus(
            @Param("from") Instant from, @Param("to") Instant to,
            @Param("status") OrderStatus status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = :status AND o.paymentStatus = :paymentStatus AND o.createdAt >= :from AND o.createdAt <= :to")
    BigDecimal sumTotalAmountByStatusAndPaymentAndDateBetween(
            @Param("status") OrderStatus status,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("from") Instant from,
            @Param("to") Instant to
    );

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status AND o.paymentStatus = :paymentStatus AND o.createdAt >= :from AND o.createdAt <= :to")
    long countByStatusAndPaymentAndDateBetween(
            @Param("status") OrderStatus status,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("from") Instant from,
            @Param("to") Instant to
    );
}
