package com.kpabk.kpabk_connect.payment.controller;

import com.kpabk.kpabk_connect.auth.model.User;
import com.kpabk.kpabk_connect.auth.repository.UserRepository;
import com.kpabk.kpabk_connect.payment.dto.*;
import com.kpabk.kpabk_connect.payment.model.PaymentStatus;
import com.kpabk.kpabk_connect.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Payment API: customer (create payment, get payment), admin (list, refund).
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping("/create/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('OUTLET') or hasRole('ADMIN')")
    @Operation(summary = "Create payment for order", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PaymentInitiationResponse> createPayment(@PathVariable UUID orderId) {
        PaymentInitiationResponse response = paymentService.createPayment(orderId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{paymentId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('OUTLET') or hasRole('ADMIN')")
    @Operation(summary = "Get payment by id", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PaymentResponse> getPayment(
            @PathVariable UUID paymentId,
            Authentication authentication
    ) {
        Long userId = resolveCurrentUserId().orElse(null);
        boolean admin = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        PaymentResponse payment;
        if (Boolean.TRUE.equals(admin)) {
            payment = paymentService.getById(paymentId);
        } else if (userId != null) {
            payment = paymentService.getByIdForCustomer(paymentId, userId);
        } else {
            payment = paymentService.getById(paymentId);
        }
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Initiate refund (admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<RefundResponse> refund(
            @PathVariable UUID paymentId,
            @Valid @RequestBody(required = false) RefundRequest body
    ) {
        java.math.BigDecimal amount = (body != null && body.getAmount() != null) ? body.getAmount() : null;
        String reason = (body != null) ? body.getReason() : null;
        RefundResponse response = paymentService.refund(paymentId, amount, reason);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List payments with filters (admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PageResponse<PaymentResponse>> listPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toDate
    ) {
        PageResponse<PaymentResponse> result = paymentService.listPayments(page, size, status, fromDate, toDate);
        return ResponseEntity.ok(result);
    }

    private Optional<Long> resolveCurrentUserId() {
        return Optional.ofNullable(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName)
                .flatMap(userRepository::findByEmail)
                .map(User::getId);
    }
}
