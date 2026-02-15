package com.kpabk.kpabk_connect.user.dto;

import com.kpabk.kpabk_connect.auth.model.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {

    @NotBlank(message = "Email is required")
    @Email
    @Size(max = 255)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100)
    private String password;

    @Size(max = 100)
    private String firstName;

    @Size(max = 100)
    private String lastName;

    @NotNull(message = "Role is required")
    private RoleName role;

    /**
     * Required when role is OUTLET. Must be a valid outlet id.
     */
    private Long outletId;

    @Size(max = 20)
    private String phone;
}
