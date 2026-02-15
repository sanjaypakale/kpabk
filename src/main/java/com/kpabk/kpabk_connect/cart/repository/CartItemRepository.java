package com.kpabk.kpabk_connect.cart.repository;

import com.kpabk.kpabk_connect.cart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser_IdOrderByCreatedAtDesc(Long userId);

    Optional<CartItem> findByUser_IdAndProduct_Id(Long userId, UUID productId);

    Optional<CartItem> findByIdAndUser_Id(Long id, Long userId);

    boolean existsByUser_IdAndProduct_Id(Long userId, UUID productId);

    void deleteByUser_Id(Long userId);
}
