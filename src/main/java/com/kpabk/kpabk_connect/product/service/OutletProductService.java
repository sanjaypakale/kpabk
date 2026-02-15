package com.kpabk.kpabk_connect.product.service;

import com.kpabk.kpabk_connect.product.dto.OutletProductRequest;
import com.kpabk.kpabk_connect.product.dto.OutletProductResponse;
import com.kpabk.kpabk_connect.product.exception.BusinessException;
import com.kpabk.kpabk_connect.product.exception.ResourceNotFoundException;
import com.kpabk.kpabk_connect.product.model.OutletProduct;
import com.kpabk.kpabk_connect.product.model.Product;
import com.kpabk.kpabk_connect.product.repository.OutletProductRepository;
import com.kpabk.kpabk_connect.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OutletProductService {

    private final OutletProductRepository outletProductRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OutletProductResponse createOrUpdate(Long outletId, OutletProductRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));
        OutletProduct op = outletProductRepository.findByOutletIdAndProductId(outletId, request.getProductId())
                .orElse(null);
        if (op == null) {
            op = OutletProduct.builder()
                    .outletId(outletId)
                    .product(product)
                    .minimumOrderQuantity(1)
                    .build();
        }
        if (request.getOutletPrice() != null) {
            op.setOutletPrice(request.getOutletPrice());
        }
        if (request.getIsAvailable() != null) {
            op.setIsAvailable(request.getIsAvailable());
        }
        if (request.getMinimumOrderQuantity() != null) {
            op.setMinimumOrderQuantity(request.getMinimumOrderQuantity());
        }
        if (request.getStockQuantity() != null) {
            op.setStockQuantity(request.getStockQuantity());
        }
        op = outletProductRepository.save(op);
        return mapToResponse(op);
    }

    @Transactional
    public void setAvailable(Long outletId, UUID productId, boolean available) {
        OutletProduct op = outletProductRepository.findByOutletIdAndProductId(outletId, productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "OutletProduct for outlet " + outletId + " and product " + productId));
        op.setIsAvailable(available);
        outletProductRepository.save(op);
    }

    @Transactional(readOnly = true)
    public List<OutletProductResponse> getProductsForOutlet(Long outletId) {
        List<OutletProduct> list = outletProductRepository.findByOutletIdAndIsAvailableTrueWithProduct(outletId);
        return list.stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public OutletProductResponse getOutletProduct(Long outletId, UUID productId) {
        OutletProduct op = outletProductRepository.findByOutletIdAndProductId(outletId, productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "OutletProduct for outlet " + outletId + " and product " + productId));
        return mapToResponse(op);
    }

    private OutletProductResponse mapToResponse(OutletProduct op) {
        Product p = op.getProduct();
        return OutletProductResponse.builder()
                .id(op.getId())
                .outletId(op.getOutletId())
                .productId(p.getId())
                .productName(p.getName())
                .description(p.getDescription())
                .productType(p.getProductType())
                .unit(p.getUnit())
                .basePrice(p.getBasePrice())
                .outletPrice(op.getOutletPrice())
                .imageUrl(p.getImageUrl())
                .isAvailable(op.getIsAvailable())
                .minimumOrderQuantity(op.getMinimumOrderQuantity() != null ? op.getMinimumOrderQuantity() : 1)
                .stockQuantity(op.getStockQuantity())
                .categoryName(p.getCategory().getName())
                .updatedAt(op.getUpdatedAt())
                .build();
    }
}
