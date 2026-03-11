package com.bcm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * System Configuration Entity
 * Stores global system settings including organization branding and BIA configuration
 */
@Entity
@Table(name = "system_configuration")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SystemConfiguration extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Configuration category (e.g., "organization", "bia_config", "email", "security")
     */
    @Column(nullable = false, unique = true, length = 100)
    private String category;

    /**
     * Configuration key within the category
     */
    @Column(nullable = false, length = 100)
    private String configKey;

    /**
     * Configuration value (stored as JSON for complex objects)
     */
    @Column(columnDefinition = "TEXT")
    private String configValue;

    /**
     * Data type of the value (string, number, boolean, json)
     */
    @Column(length = 50)
    private String dataType;

    /**
     * Description of this configuration setting
     */
    @Column(length = 500)
    private String description;

    /**
     * Whether this setting is editable by users
     */
    @Column(nullable = false)
    private Boolean isEditable = true;

    /**
     * Whether this setting requires admin privileges to edit
     */
    @Column(nullable = false)
    private Boolean requiresAdmin = true;
}

