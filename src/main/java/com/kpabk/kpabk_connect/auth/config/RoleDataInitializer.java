package com.kpabk.kpabk_connect.auth.config;

import com.kpabk.kpabk_connect.auth.model.Role;
import com.kpabk.kpabk_connect.auth.model.RoleName;
import com.kpabk.kpabk_connect.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
@RequiredArgsConstructor
public class RoleDataInitializer {

    private final RoleRepository roleRepository;

    @Bean
    @Order(1)
    public ApplicationRunner initRoles() {
        return args -> {
            for (RoleName name : RoleName.values()) {
                roleRepository.findByName(name).orElseGet(() -> roleRepository.save(Role.builder().name(name).build()));
            }
        };
    }
}
