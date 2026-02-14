package com.kpabk.kpabk_connect.order.controller;

import com.kpabk.kpabk_connect.auth.model.User;
import com.kpabk.kpabk_connect.auth.repository.UserRepository;
import com.kpabk.kpabk_connect.order.dto.OrderResponse;
import com.kpabk.kpabk_connect.order.dto.PageResponse;
import com.kpabk.kpabk_connect.order.model.OrderStatus;
import com.kpabk.kpabk_connect.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Outlet-scoped order listing: GET /api/outlets/{outletId}/orders.
 * OUTLET can only access their own outletId; ADMIN can access any.
 */
@RestController
@RequestMapping("/api/outlets")
@RequiredArgsConstructor
public class OutletOrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping("/{outletId}/orders")
    @PreAuthorize("hasRole('OUTLET') or hasRole('ADMIN')")
    public ResponseEntity<PageResponse<OrderResponse>> getOrdersByOutlet(
            @PathVariable Long outletId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) OrderStatus status,
            Authentication authentication
    ) {
        Optional<Long> currentOutletId = resolveCurrentUserOutletId();
        boolean admin = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!admin && currentOutletId.map(id -> !id.equals(outletId)).orElse(true)) {
            return ResponseEntity.status(403).build();
        }
        PageResponse<OrderResponse> result = orderService.getOrdersByOutlet(outletId, page, size, status);
        return ResponseEntity.ok(result);
    }

    private Optional<Long> resolveCurrentUserOutletId() {
        return Optional.ofNullable(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName)
                .flatMap(userRepository::findByEmail)
                .map(User::getOutletId);
    }
}
