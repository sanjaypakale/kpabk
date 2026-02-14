package com.kpabk.kpabk_connect.product.repository;

import com.kpabk.kpabk_connect.product.model.OutletProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OutletProductRepository extends JpaRepository<OutletProduct, Long> {

    @Query("SELECT op FROM OutletProduct op WHERE op.outletId = :outletId AND op.product.id = :productId")
    Optional<OutletProduct> findByOutletIdAndProductId(@Param("outletId") Long outletId, @Param("productId") UUID productId);

    @Query("SELECT CASE WHEN COUNT(op) > 0 THEN true ELSE false END FROM OutletProduct op WHERE op.outletId = :outletId AND op.product.id = :productId")
    boolean existsByOutletIdAndProductId(@Param("outletId") Long outletId, @Param("productId") UUID productId);

    @Query("SELECT op FROM OutletProduct op JOIN FETCH op.product WHERE op.outletId = :outletId AND op.isAvailable = true")
    List<OutletProduct> findByOutletIdAndIsAvailableTrueWithProduct(@Param("outletId") Long outletId);
}
