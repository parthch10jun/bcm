package com.bcm.repository;

import com.bcm.entity.Process;
import com.bcm.enums.ProcessStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Process entity
 * Provides database access methods for business processes
 */
@Repository
public interface ProcessRepository extends JpaRepository<Process, Long> {

    /**
     * Find process by code
     */
    Optional<Process> findByProcessCode(String processCode);

    /**
     * Find all processes for a specific organizational unit
     */
    List<Process> findByOrganizationalUnitId(Long organizationalUnitId);

    /**
     * Find all processes by status
     */
    List<Process> findByStatus(ProcessStatus status);

    /**
     * Find all critical processes
     */
    List<Process> findByIsCriticalTrue();

    /**
     * Find all processes by name (case-insensitive, partial match)
     */
    @Query("SELECT p FROM Process p WHERE LOWER(p.processName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Process> searchByName(@Param("name") String name);

    /**
     * Check if a process code already exists
     */
    boolean existsByProcessCode(String processCode);

    /**
     * Find all processes for a specific organizational unit and status
     */
    List<Process> findByOrganizationalUnitIdAndStatus(Long organizationalUnitId, ProcessStatus status);

    /**
     * Find all critical processes for a specific organizational unit
     */
    @Query("SELECT p FROM Process p WHERE p.organizationalUnit.id = :unitId AND p.isCritical = true")
    List<Process> findCriticalProcessesByUnit(@Param("unitId") Long unitId);

    /**
     * Count total processes (including deleted, for code generation)
     */
    @Query("SELECT COUNT(p) FROM Process p")
    long countAllProcesses();

    /**
     * Count critical processes
     */
    @Query("SELECT COUNT(p) FROM Process p WHERE p.isCritical = true AND p.isDeleted = false")
    long countCriticalProcesses();

    /**
     * Find all processes that are not deleted (soft delete support)
     */
    List<Process> findByIsDeletedFalse();

    /**
     * Find all processes by organizational unit (not deleted)
     */
    @Query("SELECT p FROM Process p WHERE p.organizationalUnit.id = :unitId AND p.isDeleted = false")
    List<Process> findActiveProcessesByUnit(@Param("unitId") Long unitId);
}

