package com.kpabk.kpabk_connect.order.service;

import java.util.Map;
import java.util.UUID;

/**
 * Port for inventory deduction. Order module calls this after order placement.
 * Implemented by Inventory module (or no-op) for future event-based design.
 * Keeps order module decoupled from inventory implementation.
 */
public interface InventoryDeductionPort {

    /**
     * Request stock deduction for an order. May be async or no-op.
     *
     * @param orderId    order UUID
     * @param outletId   outlet
     * @param productQuantities map of productId -> quantity to deduct
     */
    void deductForOrder(UUID orderId, Long outletId, Map<UUID, Integer> productQuantities);
}
