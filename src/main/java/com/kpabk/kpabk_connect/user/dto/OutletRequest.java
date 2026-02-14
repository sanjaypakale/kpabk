package com.kpabk.kpabk_connect.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutletRequest {

    @NotBlank(message = "Outlet name is required")
    @Size(max = 255)
    private String outletName;

    @NotBlank(message = "Owner name is required")
    @Size(max = 255)
    private String ownerName;

    @NotBlank(message = "Email is required")
    @Email
    @Size(max = 255)
    private String email;

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 500)
    private String address;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
    private String state;

    @Size(max = 20)
    private String pincode;

    private Boolean isActive;
}
