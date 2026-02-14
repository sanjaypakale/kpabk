package com.kpabk.kpabk_connect.user.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {

    @Size(max = 100)
    private String displayName;

    @Size(max = 20)
    private String phone;

    /**
     * For OUTLET role only. Omit or null = no change. Use 0 to unassign from outlet.
     */
    private Long outletId;
}
