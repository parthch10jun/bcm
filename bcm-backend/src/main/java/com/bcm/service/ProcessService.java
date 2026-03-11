package com.bcm.service;

import com.bcm.dto.CreateProcessRequest;
import com.bcm.dto.ProcessDTO;
import com.bcm.dto.UpdateProcessRequest;
import com.bcm.entity.OrganizationalUnit;
import com.bcm.entity.Process;
import com.bcm.enums.ProcessStatus;
import com.bcm.exception.ResourceNotFoundException;
import com.bcm.repository.OrganizationalUnitRepository;
import com.bcm.repository.ProcessRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Process operations
 * Handles business logic for process management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProcessService {

    private final ProcessRepository processRepository;
    private final OrganizationalUnitRepository organizationalUnitRepository;

    /**
     * Get all processes
     */
    @Transactional(readOnly = true)
    public List<ProcessDTO> getAllProcesses() {
        log.info("Fetching all processes");
        return processRepository.findByIsDeletedFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get process by ID
     */
    @Transactional(readOnly = true)
    public ProcessDTO getProcessById(Long id) {
        log.info("Fetching process with ID: {}", id);
        Process process = processRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Process not found with ID: " + id));
        
        if (process.getIsDeleted()) {
            throw new ResourceNotFoundException("Process not found with ID: " + id);
        }
        
        return convertToDTO(process);
    }

    /**
     * Get all processes for a specific organizational unit
     */
    @Transactional(readOnly = true)
    public List<ProcessDTO> getProcessesByUnit(Long unitId) {
        log.info("Fetching processes for organizational unit ID: {}", unitId);
        
        // Verify unit exists
        if (!organizationalUnitRepository.existsById(unitId)) {
            throw new ResourceNotFoundException("Organizational unit not found with ID: " + unitId);
        }
        
        return processRepository.findActiveProcessesByUnit(unitId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all processes by status
     */
    @Transactional(readOnly = true)
    public List<ProcessDTO> getProcessesByStatus(ProcessStatus status) {
        log.info("Fetching processes with status: {}", status);
        return processRepository.findByStatus(status).stream()
                .filter(p -> !p.getIsDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all critical processes
     */
    @Transactional(readOnly = true)
    public List<ProcessDTO> getCriticalProcesses() {
        log.info("Fetching critical processes");
        return processRepository.findByIsCriticalTrue().stream()
                .filter(p -> !p.getIsDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search processes by name
     */
    @Transactional(readOnly = true)
    public List<ProcessDTO> searchProcessesByName(String name) {
        log.info("Searching processes by name: {}", name);
        return processRepository.searchByName(name).stream()
                .filter(p -> !p.getIsDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new process
     */
    public ProcessDTO createProcess(CreateProcessRequest request) {
        log.info("Creating new process: {}", request.getProcessName());

        // Verify organizational unit exists
        OrganizationalUnit unit = organizationalUnitRepository.findById(request.getOrganizationalUnitId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Organizational unit not found with ID: " + request.getOrganizationalUnitId()));

        // Validate process name is unique within the organizational unit
        List<Process> existingProcesses = processRepository.findActiveProcessesByUnit(request.getOrganizationalUnitId());
        boolean nameExists = existingProcesses.stream()
                .anyMatch(p -> p.getProcessName().equalsIgnoreCase(request.getProcessName()));
        if (nameExists) {
            throw new IllegalArgumentException(
                    "Process name '" + request.getProcessName() + "' already exists in this organizational unit");
        }

        // Auto-generate process code if not provided
        String processCode = request.getProcessCode();
        if (processCode == null || processCode.isEmpty()) {
            processCode = generateProcessCode();
        } else {
            // Check if process code already exists (globally unique)
            if (processRepository.existsByProcessCode(processCode)) {
                throw new IllegalArgumentException("Process code already exists: " + processCode);
            }
        }

        // Create process entity
        Process process = Process.builder()
                .processName(request.getProcessName())
                .processCode(processCode)
                .description(request.getDescription())
                .organizationalUnit(unit)
                .processOwner(request.getProcessOwner())
                .status(request.getStatus() != null ? request.getStatus() : ProcessStatus.DRAFT)
                .isCritical(false) // Criticality is determined by BIA, not at creation
                .build();

        // Set audit fields
        process.setCreatedAt(LocalDateTime.now());
        process.setCreatedBy("system"); // TODO: Get from security context
        process.setIsDeleted(false);

        Process savedProcess = processRepository.save(process);
        log.info("Process created successfully with ID: {} and code: {}", savedProcess.getId(), savedProcess.getProcessCode());

        return convertToDTO(savedProcess);
    }

    /**
     * Generate a unique process code
     */
    private String generateProcessCode() {
        long count = processRepository.countAllProcesses();
        String code;
        int attempt = 0;
        do {
            code = String.format("PROC-%04d", count + 1 + attempt);
            attempt++;
        } while (processRepository.existsByProcessCode(code));
        return code;
    }

    /**
     * Update an existing process
     */
    public ProcessDTO updateProcess(Long id, UpdateProcessRequest request) {
        log.info("Updating process with ID: {}", id);

        Process process = processRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Process not found with ID: " + id));

        if (process.getIsDeleted()) {
            throw new ResourceNotFoundException("Process not found with ID: " + id);
        }

        // Update fields if provided
        if (request.getProcessName() != null) {
            process.setProcessName(request.getProcessName());
        }

        if (request.getProcessCode() != null) {
            // Check if new code conflicts with existing
            if (!request.getProcessCode().equals(process.getProcessCode()) &&
                processRepository.existsByProcessCode(request.getProcessCode())) {
                throw new IllegalArgumentException("Process code already exists: " + request.getProcessCode());
            }
            process.setProcessCode(request.getProcessCode());
        }

        if (request.getDescription() != null) {
            process.setDescription(request.getDescription());
        }

        if (request.getOrganizationalUnitId() != null) {
            OrganizationalUnit unit = organizationalUnitRepository.findById(request.getOrganizationalUnitId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Organizational unit not found with ID: " + request.getOrganizationalUnitId()));
            process.setOrganizationalUnit(unit);
        }

        if (request.getProcessOwner() != null) {
            process.setProcessOwner(request.getProcessOwner());
        }

        if (request.getStatus() != null) {
            process.setStatus(request.getStatus());
        }

        // Note: isCritical is not updated here - it's determined by BIA analysis

        // Update audit fields
        process.setUpdatedAt(LocalDateTime.now());
        process.setUpdatedBy("system"); // TODO: Get from security context

        Process updatedProcess = processRepository.save(process);
        log.info("Process updated successfully with ID: {}", updatedProcess.getId());

        return convertToDTO(updatedProcess);
    }

    /**
     * Delete a process (soft delete)
     */
    public void deleteProcess(Long id) {
        log.info("Deleting process with ID: {}", id);

        Process process = processRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Process not found with ID: " + id));

        if (process.getIsDeleted()) {
            throw new ResourceNotFoundException("Process not found with ID: " + id);
        }

        // Check if process has associated BIAs
        if (process.getBiaRecords() != null && !process.getBiaRecords().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete process with associated BIA records. Please delete BIAs first.");
        }

        // Soft delete
        process.setIsDeleted(true);
        process.setUpdatedAt(LocalDateTime.now());
        process.setUpdatedBy("system"); // TODO: Get from security context

        processRepository.save(process);
        log.info("Process soft deleted successfully with ID: {}", id);
    }

    /**
     * Convert Process entity to DTO
     */
    private ProcessDTO convertToDTO(Process process) {
        return ProcessDTO.builder()
                .id(process.getId())
                .processName(process.getProcessName())
                .processCode(process.getProcessCode())
                .description(process.getDescription())
                .organizationalUnitId(process.getOrganizationalUnit().getId())
                .organizationalUnitName(process.getOrganizationalUnit().getUnitName())
                .organizationalUnitCode(process.getOrganizationalUnit().getUnitCode())
                .processOwner(process.getProcessOwner())
                .status(process.getStatus())
                .isCritical(process.getIsCritical())
                .createdAt(process.getCreatedAt())
                .updatedAt(process.getUpdatedAt())
                .createdBy(process.getCreatedBy())
                .updatedBy(process.getUpdatedBy())
                .biaCount(process.getBiaRecords() != null ? process.getBiaRecords().size() : 0)
                .build();
    }
}

