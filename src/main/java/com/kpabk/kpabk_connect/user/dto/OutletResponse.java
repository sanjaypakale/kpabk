package com.kpabk.kpabk_connect.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutletResponse {

    private Long id;
    private String outletName;
    private String ownerName;
    private String email;
    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
