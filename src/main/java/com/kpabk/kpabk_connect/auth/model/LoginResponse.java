package com.kpabk.kpabk_connect.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private Long expiresInSeconds;
    private String email;
    private RoleName role;
    private Long outletId;
}
