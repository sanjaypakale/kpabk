package com.kpabk.kpabk_connect.payment.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "payment.razorpay")
@Getter
@Setter
public class RazorpayProperties {

    private String keyId;
    private String keySecret;
    private String webhookSecret;
}
