package com.kpabk.kpabk_connect.order.service;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

/**
 * No-op implementation of InventoryDeductionPort until Inventory module is wired.
 * Replace with real implementation or event publisher (e.g. Kafka) when ready.
 */
@Component
public class NoOpInventoryDeduction implements InventoryDeductionPort {

    @Override
    public void deductForOrder(UUID orderId, Long outletId, Map<UUID, Integer> productQuantities) {
        // No-op; future: publish OrderPlacedEvent or call Inventory service
    }
}
