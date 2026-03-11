package com.bcm.entity;

import com.bcm.enums.LikelihoodLevel;
import com.bcm.enums.RiskImpactLevel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Threat Entity - The real catalog item representing specific threats
 * Examples: Flood/Flash Flood, Cyber Attack, Political Difference, Pandemic, etc.
 */
@Entity
@Table(name = "threats", indexes = {
    @Index(name = "idx_threats_name", columnList = "name"),
    @Index(name = "idx_threats_type", columnList = "threat_type_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Threat extends BaseEntity {

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "threat_type_id", nullable = false)
    private ThreatType threatType;

    // Default likelihood rating for this threat (can be overridden in specific RAs)
    @Enumerated(EnumType.STRING)
    @Column(name = "default_likelihood", length = 50)
    private LikelihoodLevel defaultLikelihood;

    // Default impact rating for this threat (can be overridden in specific RAs)
    @Enumerated(EnumType.STRING)
    @Column(name = "default_impact", length = 50)
    private RiskImpactLevel defaultImpact;

    // Velocity: how quickly the threat materializes (e.g., Immediate, Hours, Days, Weeks)
    @Column(name = "velocity", length = 50)
    private String velocity;

    // Warning time: how much advance warning is typically available
    @Column(name = "warning_time", length = 50)
    private String warningTime;

    // Recovery complexity: how difficult it is to recover from this threat
    @Column(name = "recovery_complexity", length = 50)
    private String recoveryComplexity;

    @Column(name = "display_order")
    private Integer displayOrder;

    // Which enabler types (BETH3V) this threat can impact
    @OneToMany(mappedBy = "threat", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<ThreatEnablerType> threatEnablerTypes = new ArrayList<>();

    // Which risk categories this threat is associated with
    @OneToMany(mappedBy = "threat", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<RiskCategoryThreat> riskCategoryThreats = new ArrayList<>();
}

