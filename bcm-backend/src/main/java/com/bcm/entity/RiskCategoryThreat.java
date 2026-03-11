package com.bcm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * RiskCategoryThreat Entity - Junction table mapping which threats are allowed for each risk category
 * This is what the UI manages when you "Select multiple threats" for a risk category
 */
@Entity
@Table(name = "risk_category_threats",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_risk_category_threat", columnNames = {"risk_category_id", "threat_id"})
    },
    indexes = {
        @Index(name = "idx_risk_category_threat_category", columnList = "risk_category_id"),
        @Index(name = "idx_risk_category_threat_threat", columnList = "threat_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskCategoryThreat extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "risk_category_id", nullable = false)
    @JsonIgnore  // Prevent circular reference during JSON serialization
    private RiskCategory riskCategory;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "threat_id", nullable = false)
    @JsonIgnore  // Prevent circular reference during JSON serialization
    private Threat threat;

    @Column(name = "is_default_selected")
    @Builder.Default
    private Boolean isDefaultSelected = false;
}

