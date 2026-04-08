package com.ayrfu.ayrfu.security;


public class RoleConstants {
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_SUPER_USER = "ROLE_SUPER_USER";
    public static final String ROLE_CANDIDATE = "ROLE_CANDIDATE";
    public static final String ROLE_CLIENT = "ROLE_CLIENT";

    // Private constructor to prevent instantiation
    private RoleConstants() {
        throw new IllegalStateException("Utility class");
    }
}