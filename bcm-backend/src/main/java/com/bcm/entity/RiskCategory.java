package com.bcm.entity;

import com.bcm.enums.RiskCategoryCode;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * RiskCategory Entity - Defines the "assessment lens" or context type for risk assessments
 * Examples: Location Level, Process, Suppliers, Application/Software, Org Unit
 */
@Entity
@Table(name = "risk_categories", indexes = {
    @Index(name = "idx_risk_categories_code", columnList = "code", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskCategory extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private RiskCategoryCode code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    // Which threats are allowed for this risk category
    @OneToMany(mappedBy = "riskCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<RiskCategoryThreat> riskCategoryThreats = new ArrayList<>();
}

