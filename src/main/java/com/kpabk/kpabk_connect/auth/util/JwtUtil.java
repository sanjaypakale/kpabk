package com.kpabk.kpabk_connect.auth.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT creation and parsing. Uses HMAC-SHA with key from config.
 */
@Component
public class JwtUtil {

    private final JwtProperties properties;
    private final SecretKey key;

    public JwtUtil(JwtProperties properties) {
        this.properties = properties;
        byte[] keyBytes = properties.getSecret().getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String subject, String email, String roleName, Long outletId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + properties.getExpirationSeconds() * 1000);
        return Jwts.builder()
                .setSubject(subject)
                .claim("email", email)
                .claim("role", roleName)
                .claim("outletId", outletId)
                .setIssuer(properties.getIssuer())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key)
                .compact();
    }

    public JwtClaims parseToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            String subject = claims.getSubject();
            String email = claims.get("email", String.class);
            String role = claims.get("role", String.class);
            Number outletIdNum = claims.get("outletId", Number.class);
            Long outletId = outletIdNum != null ? outletIdNum.longValue() : null;
            return new JwtClaims(subject, email, role, outletId);
        } catch (JwtException e) {
            return null;
        }
    }

    public long getExpirationSeconds() {
        return properties.getExpirationSeconds();
    }

    public record JwtClaims(String subject, String email, String role, Long outletId) {}
}
