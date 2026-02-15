package com.kpabk.kpabk_connect.cart.controller;

import com.kpabk.kpabk_connect.auth.model.User;
import com.kpabk.kpabk_connect.auth.repository.UserRepository;
import com.kpabk.kpabk_connect.cart.dto.AddToCartRequest;
import com.kpabk.kpabk_connect.cart.dto.CartItemResponse;
import com.kpabk.kpabk_connect.cart.dto.UpdateCartRequest;
import com.kpabk.kpabk_connect.cart.service.CartService;
import com.kpabk.kpabk_connect.product.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Cart API: add product to cart, get current user's cart items.
 * Logged-in user is resolved via SecurityContext (JWT principal is email); use @AuthenticationPrincipal User when available.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CartItemResponse>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication
    ) {
        Long currentUserId = resolveCurrentUserId(authentication);
        CartItemResponse item = cartService.addToCart(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Added to cart", item));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCart(Authentication authentication) {
        Long currentUserId = resolveCurrentUserId(authentication);
        List<CartItemResponse> items = cartService.getCartItems(currentUserId);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateCart(
            @Valid @RequestBody UpdateCartRequest request,
            Authentication authentication
    ) {
        Long currentUserId = resolveCurrentUserId(authentication);
        CartItemResponse item = cartService.updateQuantity(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", item));
    }

    @DeleteMapping("/items/{cartItemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeItem(
            @PathVariable Long cartItemId,
            Authentication authentication
    ) {
        Long currentUserId = resolveCurrentUserId(authentication);
        cartService.removeItem(currentUserId, cartItemId);
        return ResponseEntity.noContent().build();
    }

    private Long resolveCurrentUserId(Authentication authentication) {
        return java.util.Optional.ofNullable(authentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName)
                .flatMap(userRepository::findByEmail)
                .map(User::getId)
                .orElseThrow(() -> new IllegalStateException("Current user not found"));
    }
}
