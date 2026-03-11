package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * BIA Dependent Person Entity
 * 
 * Junction table linking BIAs to People (Human Resources).
 * This is part of the BETH3V dependency mapping.
 * 
 * Tracks which people/roles are required for a process/service to function,
 * including key personnel and recovery team members.
 */
@Entity
@Table(name = "bia_dependent_people",
    indexes = {
        @Index(name = "idx_bia_dep_people_bia", columnList = "bia_id"),
        @Index(name = "idx_bia_dep_people_user", columnList = "user_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_bia_user", columnNames = {"bia_id", "user_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaDependentPerson extends BaseEntity {

    /**
     * Link to the BIA record
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord biaRecord;

    /**
     * Link to the User (Person)
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Role of this person in the BIA context
     * Examples: "Key Personnel", "Recovery Team", "Subject Matter Expert", "Backup Resource"
     */
    @Column(name = "role_in_bia", length = 255)
    private String roleInBia;

    /**
     * Is this person critical for the process/service?
     */
    @Column(name = "is_critical")
    @Builder.Default
    private Boolean isCritical = false;

    /**
     * Additional notes about this person's role
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /**
     * Helper method to check if this is a key personnel
     */
    public boolean isKeyPersonnel() {
        return isCritical != null && isCritical;
    }

    /**
     * Helper method to check if this is a recovery team member
     */
    public boolean isRecoveryTeam() {
        return roleInBia != null && roleInBia.toLowerCase().contains("recovery");
    }

    /**
     * Helper method to check if this is a backup resource
     */
    public boolean isBackupResource() {
        return roleInBia != null && roleInBia.toLowerCase().contains("backup");
    }
}

