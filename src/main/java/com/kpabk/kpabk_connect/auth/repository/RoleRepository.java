package com.kpabk.kpabk_connect.auth.repository;

import com.kpabk.kpabk_connect.auth.model.Role;
import com.kpabk.kpabk_connect.auth.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleName name);
}
