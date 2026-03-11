package com.bcm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * ThreatType Entity - Categorizes threats for grouping and filtering
 * Examples: Natural Disaster, Man-made Disaster, IT/Equipment Disruption, Cyber Security, etc.
 */
@Entity
@Table(name = "threat_types", indexes = {
    @Index(name = "idx_threat_types_name", columnList = "name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThreatType extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order")
    private Integer displayOrder;

    @OneToMany(mappedBy = "threatType", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<Threat> threats = new ArrayList<>();
}

