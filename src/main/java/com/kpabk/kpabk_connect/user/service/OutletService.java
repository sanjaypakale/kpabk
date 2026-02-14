package com.kpabk.kpabk_connect.user.service;

import com.kpabk.kpabk_connect.user.dto.OutletRequest;
import com.kpabk.kpabk_connect.user.dto.OutletResponse;
import com.kpabk.kpabk_connect.user.dto.PageResponse;
import com.kpabk.kpabk_connect.user.exception.BusinessRuleException;
import com.kpabk.kpabk_connect.user.exception.ResourceNotFoundException;
import com.kpabk.kpabk_connect.user.model.Outlet;
import com.kpabk.kpabk_connect.user.repository.OutletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OutletService {

    private final OutletRepository outletRepository;

    @Transactional
    public OutletResponse create(OutletRequest request) {
        if (outletRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BusinessRuleException("Outlet with email already exists: " + request.getEmail());
        }
        Outlet outlet = mapToEntity(request, new Outlet());
        outlet = outletRepository.save(outlet);
        return mapToResponse(outlet);
    }

    @Transactional(readOnly = true)
    public OutletResponse getById(Long id) {
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet", id));
        return mapToResponse(outlet);
    }

    @Transactional(readOnly = true)
    public PageResponse<OutletResponse> list(Pageable pageable, Boolean isActive) {
        Page<Outlet> page = isActive != null
                ? outletRepository.findByIsActive(isActive, pageable)
                : outletRepository.findAll(pageable);
        return PageResponse.<OutletResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    @Transactional
    public OutletResponse update(Long id, OutletRequest request) {
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet", id));
        String newEmail = request.getEmail().trim().toLowerCase();
        if (!outlet.getEmail().equalsIgnoreCase(newEmail) && outletRepository.existsByEmail(newEmail)) {
            throw new BusinessRuleException("Outlet with email already exists: " + request.getEmail());
        }
        mapToEntity(request, outlet);
        outlet = outletRepository.save(outlet);
        return mapToResponse(outlet);
    }

    @Transactional
    public void delete(Long id) {
        if (!outletRepository.existsById(id)) {
            throw new ResourceNotFoundException("Outlet", id);
        }
        outletRepository.deleteById(id);
    }

    /**
     * For use by other modules (e.g. resolving outlet name for user response).
     */
    public String getOutletNameById(Long id) {
        if (id == null) return null;
        return outletRepository.findById(id).map(Outlet::getOutletName).orElse(null);
    }

    private static Outlet mapToEntity(OutletRequest request, Outlet outlet) {
        outlet.setOutletName(request.getOutletName().trim());
        outlet.setOwnerName(request.getOwnerName().trim());
        outlet.setEmail(request.getEmail().trim().toLowerCase());
        outlet.setPhoneNumber(trimToNull(request.getPhoneNumber()));
        outlet.setAddress(trimToNull(request.getAddress()));
        outlet.setCity(trimToNull(request.getCity()));
        outlet.setState(trimToNull(request.getState()));
        outlet.setPincode(trimToNull(request.getPincode()));
        outlet.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        return outlet;
    }

    private OutletResponse mapToResponse(Outlet outlet) {
        return OutletResponse.builder()
                .id(outlet.getId())
                .outletName(outlet.getOutletName())
                .ownerName(outlet.getOwnerName())
                .email(outlet.getEmail())
                .phoneNumber(outlet.getPhoneNumber())
                .address(outlet.getAddress())
                .city(outlet.getCity())
                .state(outlet.getState())
                .pincode(outlet.getPincode())
                .isActive(outlet.getIsActive())
                .createdAt(outlet.getCreatedAt())
                .updatedAt(outlet.getUpdatedAt())
                .build();
    }

    private static String trimToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
