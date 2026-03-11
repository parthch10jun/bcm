package com.bcm.dto;

import com.bcm.entity.BiaPeakTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO for BIA Peak Time
 * 
 * Used for API requests and responses to avoid exposing entity internals
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BiaPeakTimeDTO {

    private Long id;
    private Long biaId;
    private String peakTimeName;
    private String description;
    private Integer peakRtoHours;
    private Integer peakRpoHours;
    private String recurrenceType;  // DAILY, WEEKLY, MONTHLY, YEARLY, ONE_TIME
    private String recurrenceDetails;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isCriticalDeadline;
    private String deadlineType;  // MONTH_END, QUARTER_END, YEAR_END, PAYROLL, REGULATORY_FILING, CUSTOM
    private String businessJustification;
    private String impactIfMissed;
    private Integer priority;
    private Boolean isActive;

    /**
     * Convert entity to DTO
     */
    public static BiaPeakTimeDTO fromEntity(BiaPeakTime entity) {
        if (entity == null) {
            return null;
        }

        return BiaPeakTimeDTO.builder()
                .id(entity.getId())
                .biaId(entity.getBiaRecord() != null ? entity.getBiaRecord().getId() : null)
                .peakTimeName(entity.getPeakTimeName())
                .description(entity.getDescription())
                .peakRtoHours(entity.getPeakRtoHours())
                .peakRpoHours(entity.getPeakRpoHours())
                .recurrenceType(entity.getRecurrenceType() != null ? entity.getRecurrenceType().name() : null)
                .recurrenceDetails(entity.getRecurrenceDetails())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .isCriticalDeadline(entity.getIsCriticalDeadline())
                .deadlineType(entity.getDeadlineType() != null ? entity.getDeadlineType().name() : null)
                .businessJustification(entity.getBusinessJustification())
                .impactIfMissed(entity.getImpactIfMissed())
                .priority(entity.getPriority())
                .isActive(entity.getIsActive())
                .build();
    }

    /**
     * Convert DTO to entity
     */
    public BiaPeakTime toEntity() {
        BiaPeakTime entity = new BiaPeakTime();
        entity.setId(this.id);
        entity.setPeakTimeName(this.peakTimeName);
        entity.setDescription(this.description);
        entity.setPeakRtoHours(this.peakRtoHours);
        entity.setPeakRpoHours(this.peakRpoHours);
        
        if (this.recurrenceType != null) {
            entity.setRecurrenceType(BiaPeakTime.RecurrenceType.valueOf(this.recurrenceType));
        }
        
        entity.setRecurrenceDetails(this.recurrenceDetails);
        entity.setStartDate(this.startDate);
        entity.setEndDate(this.endDate);
        entity.setStartTime(this.startTime);
        entity.setEndTime(this.endTime);
        entity.setIsCriticalDeadline(this.isCriticalDeadline);
        
        if (this.deadlineType != null) {
            entity.setDeadlineType(BiaPeakTime.DeadlineType.valueOf(this.deadlineType));
        }
        
        entity.setBusinessJustification(this.businessJustification);
        entity.setImpactIfMissed(this.impactIfMissed);
        entity.setPriority(this.priority);
        entity.setIsActive(this.isActive);
        
        return entity;
    }
}

