package com.bcm.repository;

import com.bcm.entity.Incident;
import com.bcm.enums.IncidentSeverity;
import com.bcm.enums.IncidentStatus;
import com.bcm.enums.IncidentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Incident entity
 */
@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    /**
     * Find incident by code
     */
    Optional<Incident> findByIncidentCodeAndIsDeletedFalse(String incidentCode);

    /**
     * Find all non-deleted incidents
     */
    List<Incident> findByIsDeletedFalseOrderByReportedDateDesc();

    /**
     * Find incidents by status
     */
    List<Incident> findByStatusAndIsDeletedFalseOrderByReportedDateDesc(IncidentStatus status);

    /**
     * Find incidents by severity
     */
    List<Incident> findBySeverityAndIsDeletedFalseOrderByReportedDateDesc(IncidentSeverity severity);

    /**
     * Find incidents by type
     */
    List<Incident> findByIncidentTypeAndIsDeletedFalseOrderByReportedDateDesc(IncidentType incidentType);

    /**
     * Find incidents by coordinator
     */
    List<Incident> findByIncidentCoordinatorAndIsDeletedFalseOrderByReportedDateDesc(String coordinator);

    /**
     * Find active incidents (not resolved or closed)
     */
    @Query("SELECT i FROM Incident i WHERE i.status NOT IN ('RESOLVED', 'CLOSED') AND i.isDeleted = false ORDER BY i.reportedDate DESC")
    List<Incident> findActiveIncidents();

    /**
     * Find incidents reported within a date range
     */
    @Query("SELECT i FROM Incident i WHERE i.reportedDate BETWEEN :startDate AND :endDate AND i.isDeleted = false ORDER BY i.reportedDate DESC")
    List<Incident> findByReportedDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Search incidents by title or description
     */
    @Query("SELECT i FROM Incident i WHERE (LOWER(i.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND i.isDeleted = false ORDER BY i.reportedDate DESC")
    List<Incident> searchIncidents(@Param("searchTerm") String searchTerm);

    /**
     * Find incidents linked to a specific process
     */
    @Query("SELECT i FROM Incident i JOIN i.linkedProcesses p WHERE p.id = :processId AND i.isDeleted = false ORDER BY i.reportedDate DESC")
    List<Incident> findByLinkedProcessId(@Param("processId") Long processId);

    /**
     * Find incidents linked to a specific asset
     */
    @Query("SELECT i FROM Incident i JOIN i.linkedAssets a WHERE a.id = :assetId AND i.isDeleted = false ORDER BY i.reportedDate DESC")
    List<Incident> findByLinkedAssetId(@Param("assetId") Long assetId);

    /**
     * Find incidents linked to a specific vendor
     */
    @Query("SELECT i FROM Incident i JOIN i.linkedVendors v WHERE v.id = :vendorId AND i.isDeleted = false ORDER BY i.reportedDate DESC")
    List<Incident> findByLinkedVendorId(@Param("vendorId") Long vendorId);

    /**
     * Check if incident code exists
     */
    boolean existsByIncidentCodeAndIsDeletedFalse(String incidentCode);

    /**
     * Count incidents by status
     */
    long countByStatusAndIsDeletedFalse(IncidentStatus status);

    /**
     * Count incidents by severity
     */
    long countBySeverityAndIsDeletedFalse(IncidentSeverity severity);
}

