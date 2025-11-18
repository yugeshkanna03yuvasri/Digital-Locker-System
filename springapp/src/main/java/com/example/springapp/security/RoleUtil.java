package com.example.springapp.security;

public final class RoleUtil {
    private RoleUtil() {}

    public static String normalize(String role) {
        if (role == null) return "ROLE_USER";
        role = role.trim();
        if (role.isEmpty()) return "ROLE_USER";
        if (role.startsWith("ROLE_")) return role;
        return "ROLE_" + role;
    }
}
