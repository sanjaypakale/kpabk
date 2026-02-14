package com.kpabk.kpabk_connect.user.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Extended profile for users (auth User has email, displayName, etc.).
 * Links to auth users by user_id. Stores phone and other profile fields.
 * H2 and PostgreSQL compatible.
 */
@Schema(hidden = true)
@Entity
@Table(name = "user_profiles", indexes = {
    @Index(name = "idx_user_profile_user_id", columnList = "user_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * FK to auth.users.id. One-to-one with auth User.
     */
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(length = 20)
    private String phone;

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
