package com.kpabk.kpabk_connect.user.dto;

import com.kpabk.kpabk_connect.auth.model.RoleName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Profile for the currently logged-in user (from JWT).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String displayName;  // computed: firstName + " " + lastName
    private String phone;
    private RoleName role;
    private Long outletId;
    private String outletName;
    private Boolean enabled;
    private Instant createdAt;
    private Instant updatedAt;
}
