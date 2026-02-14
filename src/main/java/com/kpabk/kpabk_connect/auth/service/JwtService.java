package com.kpabk.kpabk_connect.auth.service;

import com.kpabk.kpabk_connect.auth.model.LoginResponse;
import com.kpabk.kpabk_connect.auth.model.User;
import com.kpabk.kpabk_connect.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtUtil jwtUtil;

    public LoginResponse buildLoginResponse(User user) {
        String token = jwtUtil.generateToken(
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getRole().getName().name(),
                user.getOutletId()
        );
        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresInSeconds(jwtUtil.getExpirationSeconds())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .outletId(user.getOutletId())
                .build();
    }
}
