package com.kpabk.kpabk_connect.product.controller;

import com.kpabk.kpabk_connect.product.dto.ApiResponse;
import com.kpabk.kpabk_connect.product.dto.OutletProductRequest;
import com.kpabk.kpabk_connect.product.dto.OutletProductResponse;
import com.kpabk.kpabk_connect.product.service.OutletProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/outlets")
@RequiredArgsConstructor
public class OutletProductController {

    private final OutletProductService outletProductService;

    @GetMapping("/{outletId}/products")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OUTLET')")
    public ResponseEntity<ApiResponse<List<OutletProductResponse>>> getProductsForOutlet(@PathVariable Long outletId) {
        List<OutletProductResponse> list = outletProductService.getProductsForOutlet(outletId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{outletId}/products/{productId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OUTLET')")
    public ResponseEntity<ApiResponse<OutletProductResponse>> getOutletProduct(
            @PathVariable Long outletId,
            @PathVariable UUID productId
    ) {
        return ResponseEntity.ok(ApiResponse.success(outletProductService.getOutletProduct(outletId, productId)));
    }

    @PutMapping("/{outletId}/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OutletProductResponse>> upsertOutletProduct(
            @PathVariable Long outletId,
            @Valid @RequestBody OutletProductRequest request
    ) {
        OutletProductResponse result = outletProductService.createOrUpdate(outletId, request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping("/{outletId}/products/{productId}/available")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> setAvailable(
            @PathVariable Long outletId,
            @PathVariable UUID productId,
            @RequestParam boolean available
    ) {
        outletProductService.setAvailable(outletId, productId, available);
        return ResponseEntity.noContent().build();
    }
}
