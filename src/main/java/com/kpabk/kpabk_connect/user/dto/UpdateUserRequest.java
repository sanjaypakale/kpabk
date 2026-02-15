package com.kpabk.kpabk_connect.user.dto;

import com.kpabk.kpabk_connect.auth.model.RoleName;
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
    private String firstName;

    @Size(max = 100)
    private String lastName;

    @Size(max = 20)
    private String phone;

    /** New role. When set to OUTLET, outletId may be required; when set to ADMIN, outletId is cleared. */
    private RoleName role;

    /**
     * For OUTLET role only. Omit or null = no change. Use 0 to unassign from outlet.
     */
    private Long outletId;
}
