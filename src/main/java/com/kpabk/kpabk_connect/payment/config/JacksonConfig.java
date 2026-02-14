package com.kpabk.kpabk_connect.payment.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Provides ObjectMapper for payment module (webhook JSON parsing).
 * Spring Boot usually auto-configures this; this bean ensures it is available.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
