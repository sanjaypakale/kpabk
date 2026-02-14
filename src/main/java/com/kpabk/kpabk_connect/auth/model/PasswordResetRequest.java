package com.kpabk.kpabk_connect.auth.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequest {

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    /**
     * New password (e.g. after token validation in a real flow).
     */
    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 100)
    private String newPassword;

    /**
     * Optional: token from email link (for full reset flow later).
     */
    private String resetToken;
}
