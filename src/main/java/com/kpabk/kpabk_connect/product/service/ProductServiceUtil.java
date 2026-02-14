package com.kpabk.kpabk_connect.product.service;

final class ProductServiceUtil {

    private ProductServiceUtil() {}

    static String trimToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
