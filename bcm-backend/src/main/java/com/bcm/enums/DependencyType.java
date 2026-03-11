package com.bcm.enums;

/**
 * Dependency Type Enum
 * Indicates the strength/importance of a dependency relationship
 */
public enum DependencyType {
    REQUIRED,   // Dependency is critical - cannot function without it
    OPTIONAL,   // Dependency is nice to have but not critical
    PREFERRED   // Dependency is preferred but alternatives exist
}

