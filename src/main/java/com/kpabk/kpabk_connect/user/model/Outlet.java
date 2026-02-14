package com.kpabk.kpabk_connect.user.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Outlet entity for franchise locations.
 * H2 and PostgreSQL compatible. One outlet can have multiple users (via users.outlet_id).
 */
@Schema(hidden = true)
@Entity
@Table(name = "outlets", indexes = {
    @Index(name = "idx_outlet_email", columnList = "email"),
    @Index(name = "idx_outlet_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Outlet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "outlet_name", nullable = false, length = 255)
    private String outletName;

    @Column(name = "owner_name", nullable = false, length = 255)
    private String ownerName;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(length = 500)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 20)
    private String pincode;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

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
