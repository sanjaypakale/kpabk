package com.kpabk.kpabk_connect.payment.exception;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice(basePackages = "com.kpabk.kpabk_connect.payment.controller")
public class PaymentExceptionHandler {

    @Hidden
    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<ErrorBody> handlePaymentNotFound(PaymentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorBody.builder()
                        .timestamp(Instant.now())
                        .status(HttpStatus.NOT_FOUND.value())
                        .error("Not Found")
                        .message(ex.getMessage())
                        .build()
        );
    }

    @Hidden
    @ExceptionHandler(InvalidWebhookException.class)
    public ResponseEntity<ErrorBody> handleInvalidWebhook(InvalidWebhookException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorBody.builder()
                        .timestamp(Instant.now())
                        .status(HttpStatus.BAD_REQUEST.value())
                        .error("Bad Request")
                        .message(ex.getMessage())
                        .build()
        );
    }

    @Hidden
    @ExceptionHandler(PaymentValidationException.class)
    public ResponseEntity<ErrorBody> handlePaymentValidation(PaymentValidationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorBody.builder()
                        .timestamp(Instant.now())
                        .status(HttpStatus.BAD_REQUEST.value())
                        .error("Bad Request")
                        .message(ex.getMessage())
                        .build()
        );
    }

    @Hidden
    @ExceptionHandler(OrderNotFoundForPaymentException.class)
    public ResponseEntity<ErrorBody> handleOrderNotFoundForPayment(OrderNotFoundForPaymentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorBody.builder()
                        .timestamp(Instant.now())
                        .status(HttpStatus.NOT_FOUND.value())
                        .error("Not Found")
                        .message(ex.getMessage())
                        .build()
        );
    }

    @Hidden
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorBody> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(err -> {
            String field = err instanceof FieldError f ? f.getField() : err.getObjectName();
            errors.put(field, err.getDefaultMessage());
        });
        ErrorBody body = ErrorBody.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Failed")
                .message("Invalid request")
                .validationErrors(errors)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @Schema(name = "PaymentErrorBody")
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorBody {
        private Instant timestamp;
        private int status;
        private String error;
        private String message;
        private Map<String, String> validationErrors;
    }
}
