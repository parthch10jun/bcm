package com.bcm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * ThreatEnablerType Entity - Junction table mapping which enabler types a threat can impact
 * This represents the "Scenarios" in the UI (e.g., Building Unavailable, Tech Unavailable, People Unavailable)
 */
@Entity
@Table(name = "threat_enabler_types",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_threat_enabler", columnNames = {"threat_id", "enabler_type_id"})
    },
    indexes = {
        @Index(name = "idx_threat_enabler_threat", columnList = "threat_id"),
        @Index(name = "idx_threat_enabler_type", columnList = "enabler_type_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThreatEnablerType extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "threat_id", nullable = false)
    @JsonIgnore  // Prevent circular reference during JSON serialization
    private Threat threat;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enabler_type_id", nullable = false)
    private EnablerType enablerType;

    @Column(name = "scenario_description", columnDefinition = "TEXT")
    private String scenarioDescription;
}

