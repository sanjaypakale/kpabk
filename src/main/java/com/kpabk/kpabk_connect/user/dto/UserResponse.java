package com.kpabk.kpabk_connect.user.dto;

import com.kpabk.kpabk_connect.auth.model.RoleName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String displayName;  // computed: firstName + " " + lastName
    private String phone;
    private RoleName role;
    private Long outletId;
    private String outletName;  // resolved when outletId is set
    private Boolean enabled;
    private Instant createdAt;
    private Instant updatedAt;
}
