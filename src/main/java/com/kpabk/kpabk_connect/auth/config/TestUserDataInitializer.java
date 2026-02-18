package com.kpabk.kpabk_connect.auth.config;

import com.kpabk.kpabk_connect.auth.model.RoleName;
import com.kpabk.kpabk_connect.auth.model.User;
import com.kpabk.kpabk_connect.auth.repository.RoleRepository;
import com.kpabk.kpabk_connect.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class TestUserDataInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Seeds test users for development. Only creates if not already present.
     * Disable in production via profile or remove this bean.
     */
    @Bean
    @Order(3) // after RoleDataInitializer (1) and OutletDataInitializer (2)
    public ApplicationRunner initTestUsers() {
        return args -> {
            String testPassword = passwordEncoder.encode("password");

            createIfMissing("admin@gmail.com", testPassword, "Admin", "User", RoleName.ADMIN, null);
            createIfMissing("outlet@test.com", testPassword, "Outlet", "Manager", RoleName.OUTLET, 1L);
            createIfMissing("customer@gmail.com", testPassword, "Test", "Customer", RoleName.CUSTOMER, 1L);
        };
    }

    private void createIfMissing(String email, String passwordHash, String firstName, String lastName, RoleName roleName, Long outletId) {
        if (userRepository.findByEmail(email).isEmpty()) {
            roleRepository.findByName(roleName).ifPresent(role ->
                    userRepository.save(User.builder()
                            .email(email)
                            .passwordHash(passwordHash)
                            .firstName(firstName)
                            .lastName(lastName)
                            .role(role)
                            .outletId(outletId)
                            .enabled(true)
                            .build())
            );
        }
    }
}
