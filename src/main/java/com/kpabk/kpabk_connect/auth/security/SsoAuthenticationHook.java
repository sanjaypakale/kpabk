package com.kpabk.kpabk_connect.auth.security;

import com.kpabk.kpabk_connect.auth.model.User;

import java.util.Optional;

/**
 * Optional hook for SSO integration (e.g. Google OAuth, Keycloak).
 * Implement this to create or resolve a User from an external identity provider.
 * Register your implementation as a bean to plug into auth flows later.
 */
public interface SsoAuthenticationHook {

    /**
     * Provider identifier (e.g. "google", "keycloak").
     */
    String getProviderId();

    /**
     * Resolve or create user from SSO subject. Return empty if not linked.
     */
    Optional<User> resolveOrCreateUser(String subjectId, String email, String displayName);
}
