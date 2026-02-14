package com.kpabk.kpabk_connect.config;

import com.kpabk.kpabk_connect.order.dto.OrderResponse;
import com.kpabk.kpabk_connect.order.exception.OrderNotFoundException;
import com.kpabk.kpabk_connect.order.model.PaymentStatus;
import com.kpabk.kpabk_connect.order.service.OrderService;
import com.kpabk.kpabk_connect.payment.exception.OrderNotFoundForPaymentException;
import com.kpabk.kpabk_connect.payment.port.OrderAmountPort;
import com.kpabk.kpabk_connect.payment.port.OrderPaymentStatusPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

/**
 * Wires Payment module to Order module via ports. Keeps payment decoupled from order entity.
 */
@Configuration
public class PaymentOrderIntegrationConfig {

    private static final String DEFAULT_CURRENCY = "INR";

    @Bean
    public OrderAmountPort orderAmountPort(OrderService orderService) {
        return new OrderAmountPort() {
            @Override
            public java.math.BigDecimal getOrderAmount(UUID orderId) {
                try {
                    OrderResponse order = orderService.getById(orderId);
                    return order.getTotalAmount();
                } catch (OrderNotFoundException e) {
                    throw new OrderNotFoundForPaymentException(orderId);
                }
            }

            @Override
            public String getOrderCurrency(UUID orderId) {
                return DEFAULT_CURRENCY;
            }

            @Override
            public Long getOrderCustomerId(UUID orderId) {
                try {
                    OrderResponse order = orderService.getById(orderId);
                    return order.getCustomerId();
                } catch (OrderNotFoundException e) {
                    return null;
                }
            }
        };
    }

    @Bean
    public OrderPaymentStatusPort orderPaymentStatusPort(OrderService orderService) {
        return (orderId, paymentStatus) -> {
            PaymentStatus status = PaymentStatus.valueOf(paymentStatus);
            orderService.updatePaymentStatus(orderId, status);
        };
    }
}
