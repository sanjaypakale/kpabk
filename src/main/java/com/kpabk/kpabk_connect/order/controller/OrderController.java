package com.kpabk.kpabk_connect.order.controller;

import com.kpabk.kpabk_connect.auth.model.User;
import com.kpabk.kpabk_connect.auth.repository.UserRepository;
import com.kpabk.kpabk_connect.order.dto.*;
import com.kpabk.kpabk_connect.order.model.OrderStatus;
import com.kpabk.kpabk_connect.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Order API: customer (place, my orders, get by id), outlet (list by outlet, update status), admin (list all, revenue).
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    // ---- Customer ----

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('OUTLET') or hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody CreateOrderRequest request) {
        Long customerId = resolveCurrentUserId().orElse(request.getCustomerId());
        if (customerId != null && request.getCustomerId() == null) {
            request = CreateOrderRequest.builder()
                    .outletId(request.getOutletId())
                    .customerId(customerId)
                    .items(request.getItems())
                    .build();
        }
        OrderResponse created = orderService.placeOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('OUTLET') or hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> getById(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        Long userId = resolveCurrentUserId().orElse(null);
        Long outletId = resolveCurrentUserOutletId().orElse(null);
        boolean admin = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));

        OrderResponse order;
        if (Boolean.TRUE.equals(admin)) {
            order = orderService.getById(id);
        } else if (outletId != null) {
            order = orderService.getByIdAndOutletId(id, outletId);
        } else if (userId != null) {
            order = orderService.getByIdAndCustomerId(id, userId);
        } else {
            order = orderService.getById(id);
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PageResponse<OrderResponse>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) OrderStatus status,
            Authentication authentication
    ) {
        Long customerId = resolveCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Current user id not found"));
        PageResponse<OrderResponse> result = orderService.getMyOrders(customerId, page, size, status);
        return ResponseEntity.ok(result);
    }

    // ---- Outlet ----

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('OUTLET') or hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            Authentication authentication
    ) {
        boolean admin = authentication.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (admin) {
            OrderResponse updated = orderService.updateStatusByAdmin(id, request.getStatus());
            return ResponseEntity.ok(updated);
        }
        Long outletId = resolveCurrentUserOutletId().orElse(null);
        if (outletId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        OrderResponse updated = orderService.updateStatus(id, outletId, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    // ---- Admin ----

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toDate
    ) {
        PageResponse<OrderResponse> result = orderService.getAllOrders(page, size, status, fromDate, toDate);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue-summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevenueSummaryResponse> getRevenueSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toDate
    ) {
        RevenueSummaryResponse summary = orderService.getRevenueSummary(fromDate, toDate);
        return ResponseEntity.ok(summary);
    }

    private Optional<Long> resolveCurrentUserId() {
        return Optional.ofNullable(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName)
                .flatMap(userRepository::findByEmail)
                .map(User::getId);
    }

    private Optional<Long> resolveCurrentUserOutletId() {
        return Optional.ofNullable(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName)
                .flatMap(userRepository::findByEmail)
                .map(User::getOutletId);
    }
}
