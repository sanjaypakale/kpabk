package com.kpabk.kpabk_connect.auth.repository;

import com.kpabk.kpabk_connect.auth.model.RoleName;
import com.kpabk.kpabk_connect.auth.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByOutletId(Long outletId);

    Optional<User> findBySsoProviderAndSsoSubjectId(String ssoProvider, String ssoSubjectId);

    Page<User> findByRole_Name(RoleName roleName, Pageable pageable);
}
