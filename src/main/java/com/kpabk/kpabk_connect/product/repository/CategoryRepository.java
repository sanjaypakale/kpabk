package com.kpabk.kpabk_connect.product.repository;

import com.kpabk.kpabk_connect.product.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    List<Category> findByIsActiveTrueOrderByNameAsc();

    Optional<Category> findByName(String name);
}
