package com.kpabk.kpabk_connect.user.service;

import com.kpabk.kpabk_connect.auth.model.Role;
import com.kpabk.kpabk_connect.auth.model.RoleName;
import com.kpabk.kpabk_connect.auth.model.User;
import com.kpabk.kpabk_connect.auth.repository.RoleRepository;
import com.kpabk.kpabk_connect.auth.repository.UserRepository;
import com.kpabk.kpabk_connect.user.dto.*;
import com.kpabk.kpabk_connect.user.exception.BusinessRuleException;
import com.kpabk.kpabk_connect.user.exception.ResourceNotFoundException;
import com.kpabk.kpabk_connect.user.model.UserProfile;
import com.kpabk.kpabk_connect.user.repository.OutletRepository;
import com.kpabk.kpabk_connect.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;
    private final OutletRepository outletRepository;
    private final OutletService outletService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BusinessRuleException("User with email already exists: " + request.getEmail());
        }
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new BusinessRuleException("Unknown role: " + request.getRole()));

        if (request.getRole() == RoleName.OUTLET) {
            if (request.getOutletId() == null) {
                throw new BusinessRuleException("OUTLET role requires an outletId");
            }
            if (!outletRepository.existsById(request.getOutletId())) {
                throw new ResourceNotFoundException("Outlet", request.getOutletId());
            }
        } else {
            if (request.getOutletId() != null) {
                throw new BusinessRuleException("Only OUTLET role can be assigned to an outlet");
            }
        }

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(trimToNull(request.getDisplayName()))
                .role(role)
                .outletId(request.getRole() == RoleName.OUTLET ? request.getOutletId() : null)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            UserProfile profile = UserProfile.builder()
                    .userId(user.getId())
                    .phone(request.getPhone().trim())
                    .build();
            userProfileRepository.save(profile);
        }

        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsersByRole(RoleName roleName, Pageable pageable) {
        Page<User> page = userRepository.findByRole_Name(roleName, pageable);
        return PageResponse.<UserResponse>builder()
                .content(page.getContent().stream().map(this::toUserResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName().isBlank() ? null : request.getDisplayName().trim());
        }
        if (request.getOutletId() != null) {
            if (user.getRole().getName() != RoleName.OUTLET) {
                throw new BusinessRuleException("Only OUTLET role can be assigned to an outlet");
            }
            if (request.getOutletId() == 0) {
                user.setOutletId(null);
            } else {
                if (!outletRepository.existsById(request.getOutletId())) {
                    throw new ResourceNotFoundException("Outlet", request.getOutletId());
                }
                user.setOutletId(request.getOutletId());
            }
        }

        userRepository.save(user);

        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElse(null);
        if (request.getPhone() != null) {
            if (profile == null) {
                profile = UserProfile.builder().userId(user.getId()).build();
            }
            profile.setPhone(request.getPhone().isBlank() ? null : request.getPhone().trim());
            userProfileRepository.save(profile);
        }

        return toUserResponse(userRepository.findById(id).orElseThrow());
    }

    @Transactional
    public void setUserEnabled(Long id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    @Transactional
    public UserProfileResponse updateMyProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User with email not found: " + email));
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName().isBlank() ? null : request.getDisplayName().trim());
        }
        userRepository.save(user);
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElse(null);
        if (request.getPhone() != null) {
            if (profile == null) {
                profile = UserProfile.builder().userId(user.getId()).build();
            }
            profile.setPhone(request.getPhone().isBlank() ? null : request.getPhone().trim());
            userProfileRepository.save(profile);
        }
        return getProfileByEmail(email);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User with email not found: " + email));
        String phone = userProfileRepository.findByUserId(user.getId())
                .map(UserProfile::getPhone)
                .orElse(null);
        String outletName = user.getOutletId() != null
                ? outletService.getOutletNameById(user.getOutletId())
                : null;
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .phone(phone)
                .role(user.getRole().getName())
                .outletId(user.getOutletId())
                .outletName(outletName)
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private UserResponse toUserResponse(User user) {
        String phone = userProfileRepository.findByUserId(user.getId())
                .map(UserProfile::getPhone)
                .orElse(null);
        String outletName = user.getOutletId() != null
                ? outletService.getOutletNameById(user.getOutletId())
                : null;
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .phone(phone)
                .role(user.getRole().getName())
                .outletId(user.getOutletId())
                .outletName(outletName)
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private static String trimToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
