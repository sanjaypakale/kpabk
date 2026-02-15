package com.kpabk.kpabk_connect.product.model;

/**
 * Unit of measure for how a product is sold (e.g. packets, kgs, set, pieces).
 * Stored as STRING in DB for H2 and PostgreSQL compatibility.
 */
public enum ProductUnit {
    /** Packets */
    PAC,
    /** Kilograms */
    KGS,
    /** Set */
    SET,
    /** Pieces */
    PCS,
    /** Other / custom */
    OTHER
}
