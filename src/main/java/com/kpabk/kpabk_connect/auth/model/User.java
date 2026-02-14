package com.kpabk.kpabk_connect.auth.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * User entity. Links to outlet via outlet_id (FK to Outlet in outlet module).
 * Uses standard types for H2 and PostgreSQL portability.
 */
@Schema(hidden = true)
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email", unique = true),
    @Index(name = "idx_user_outlet", columnList = "outlet_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "display_name", length = 100)
    private String displayName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    /**
     * FK to Outlet entity (outlet module). Null for CUSTOMER or when not assigned.
     */
    @Column(name = "outlet_id")
    private Long outletId;

    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;

    /**
     * For optional SSO: external provider id (e.g. Google sub, Keycloak subject).
     */
    @Column(name = "sso_provider", length = 50)
    private String ssoProvider;

    @Column(name = "sso_subject_id", length = 255)
    private String ssoSubjectId;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
