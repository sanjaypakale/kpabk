package com.kpabk.kpabk_connect.user.controller;

import com.kpabk.kpabk_connect.user.dto.OutletRequest;
import com.kpabk.kpabk_connect.user.dto.OutletResponse;
import com.kpabk.kpabk_connect.user.dto.PageResponse;
import com.kpabk.kpabk_connect.user.service.OutletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/outlets")
@RequiredArgsConstructor
public class OutletController {

    private final OutletService outletService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OutletResponse> create(@Valid @RequestBody OutletRequest request) {
        OutletResponse created = outletService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OUTLET')")
    public ResponseEntity<OutletResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(outletService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<OutletResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean isActive
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("outletName").ascending());
        return ResponseEntity.ok(outletService.list(pageable, isActive));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OutletResponse> update(@PathVariable Long id, @Valid @RequestBody OutletRequest request) {
        return ResponseEntity.ok(outletService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        outletService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
