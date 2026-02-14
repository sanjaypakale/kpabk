package com.kpabk.kpabk_connect.user.config;

import com.kpabk.kpabk_connect.user.model.Outlet;
import com.kpabk.kpabk_connect.user.repository.OutletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

/**
 * Seeds a default outlet for development (e.g. for test OUTLET user with outletId=1).
 * Disable in production via profile or remove this bean.
 */
@Configuration
@RequiredArgsConstructor
public class OutletDataInitializer {

    private final OutletRepository outletRepository;

    @Bean
    @Order(2)
    public ApplicationRunner initOutlet() {
        return args -> {
            if (outletRepository.count() == 0) {
                outletRepository.save(Outlet.builder()
                        .outletName("KPABK Main Outlet")
                        .ownerName("Test Owner")
                        .email("outlet@kpabk.local")
                        .phoneNumber("+919876543210")
                        .address("123 Main Street")
                        .city("Pune")
                        .state("Maharashtra")
                        .pincode("411001")
                        .isActive(true)
                        .build());
            }
        };
    }
}
