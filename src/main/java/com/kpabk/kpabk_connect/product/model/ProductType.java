package com.kpabk.kpabk_connect.product.model;

/**
 * Product type for catalog classification.
 * H2 and PostgreSQL compatible when used with @Enumerated(EnumType.STRING).
 */
public enum ProductType {
    VEG,
    NON_VEG,
    BEVERAGE,
    SNACKS,
    DESSERT,
    OTHER
}
