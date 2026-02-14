package com.kpabk.kpabk_connect.auth.service;

import com.kpabk.kpabk_connect.auth.model.*;
import com.kpabk.kpabk_connect.auth.repository.RoleRepository;
import com.kpabk.kpabk_connect.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new IllegalArgumentException("Unknown role: " + request.getRole()));
        String hash = passwordEncoder.encode(request.getPassword());
        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(hash)
                .displayName(request.getDisplayName() != null ? request.getDisplayName().trim() : null)
                .role(role)
                .outletId(request.getOutletId())
                .enabled(true)
                .build();
        return userRepository.save(user);
    }

    public Optional<LoginResponse> login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .filter(user -> Boolean.TRUE.equals(user.getEnabled()))
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
                .map(jwtService::buildLoginResponse);
    }

    @Transactional
    public boolean requestPasswordReset(PasswordResetRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim().toLowerCase());
        if (userOpt.isEmpty()) {
            return false; // Don't reveal whether email exists
        }
        User user = userOpt.get();
        if (request.getResetToken() != null && !request.getResetToken().isBlank()) {
            // TODO: validate reset token (e.g. from email link) and then update
        }
        String hash = passwordEncoder.encode(request.getNewPassword());
        user.setPasswordHash(hash);
        userRepository.save(user);
        return true;
    }
}
