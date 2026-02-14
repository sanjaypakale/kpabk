package com.kpabk.kpabk_connect.user.repository;

import com.kpabk.kpabk_connect.user.model.Outlet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OutletRepository extends JpaRepository<Outlet, Long> {

    Page<Outlet> findByIsActive(Boolean isActive, Pageable pageable);

    boolean existsByEmail(String email);
}
