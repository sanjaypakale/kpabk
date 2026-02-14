package com.kpabk.kpabk_connect.auth.util;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

/**
 * JWT configuration. Values from application.yaml (auth.jwt.*).
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "auth.jwt")
public class JwtProperties {

    private String secret = "default-secret-change-in-production-min-256-bits";
    private long expirationSeconds = 86400L; // 24 hours
    private String issuer = "kpabk-connect";
}
