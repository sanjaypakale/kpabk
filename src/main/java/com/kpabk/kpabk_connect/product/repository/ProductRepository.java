package com.kpabk.kpabk_connect.product.repository;

import com.kpabk.kpabk_connect.product.model.Product;
import com.kpabk.kpabk_connect.product.model.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    long countByCategory_Id(UUID categoryId);

    boolean existsByName(String name);
}
