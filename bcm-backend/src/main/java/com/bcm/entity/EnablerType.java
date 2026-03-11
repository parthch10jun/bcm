package com.bcm.entity;

import com.bcm.enums.EnablerTypeCode;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * EnablerType Entity - BETH3V Resource Categories
 * Represents the types of resources/enablers in the BCM framework
 */
@Entity
@Table(name = "enabler_types", indexes = {
    @Index(name = "idx_enabler_types_code", columnList = "code", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnablerType extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private EnablerTypeCode code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order")
    private Integer displayOrder;

    @OneToMany(mappedBy = "enablerType", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<ThreatEnablerType> threatEnablerTypes = new ArrayList<>();
}

