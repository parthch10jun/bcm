package com.bcm.controller;

import com.bcm.dto.CreateProcessRequest;
import com.bcm.dto.ProcessDTO;
import com.bcm.dto.UpdateProcessRequest;
import com.bcm.enums.ProcessStatus;
import com.bcm.service.ProcessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Process management
 * Provides endpoints for CRUD operations on business processes
 */
@RestController
@RequestMapping("/api/processes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ProcessController {

    private final ProcessService processService;

    /**
     * Get all processes
     * Optional query parameter: unit_id to filter by organizational unit
     * Optional query parameter: status to filter by status
     * Optional query parameter: critical to filter critical processes
     * Optional query parameter: search to search by name
     */
    @GetMapping
    public ResponseEntity<List<ProcessDTO>> getAllProcesses(
            @RequestParam(required = false, name = "unit_id") Long unitId,
            @RequestParam(required = false) ProcessStatus status,
            @RequestParam(required = false) Boolean critical,
            @RequestParam(required = false) String search) {
        
        log.info("GET /api/processes - unitId: {}, status: {}, critical: {}, search: {}", 
                unitId, status, critical, search);

        List<ProcessDTO> processes;

        if (unitId != null) {
            processes = processService.getProcessesByUnit(unitId);
        } else if (status != null) {
            processes = processService.getProcessesByStatus(status);
        } else if (critical != null && critical) {
            processes = processService.getCriticalProcesses();
        } else if (search != null && !search.isEmpty()) {
            processes = processService.searchProcessesByName(search);
        } else {
            processes = processService.getAllProcesses();
        }

        return ResponseEntity.ok(processes);
    }

    /**
     * Get process by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProcessDTO> getProcessById(@PathVariable Long id) {
        log.info("GET /api/processes/{}", id);
        ProcessDTO process = processService.getProcessById(id);
        return ResponseEntity.ok(process);
    }

    /**
     * Create a new process
     */
    @PostMapping
    public ResponseEntity<ProcessDTO> createProcess(@Valid @RequestBody CreateProcessRequest request) {
        log.info("POST /api/processes - Creating process: {}", request.getProcessName());
        ProcessDTO createdProcess = processService.createProcess(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProcess);
    }

    /**
     * Update an existing process
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProcessDTO> updateProcess(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProcessRequest request) {
        log.info("PUT /api/processes/{} - Updating process", id);
        ProcessDTO updatedProcess = processService.updateProcess(id, request);
        return ResponseEntity.ok(updatedProcess);
    }

    /**
     * Delete a process (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id) {
        log.info("DELETE /api/processes/{}", id);
        processService.deleteProcess(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all critical processes
     */
    @GetMapping("/critical")
    public ResponseEntity<List<ProcessDTO>> getCriticalProcesses() {
        log.info("GET /api/processes/critical");
        List<ProcessDTO> processes = processService.getCriticalProcesses();
        return ResponseEntity.ok(processes);
    }

    /**
     * Search processes by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProcessDTO>> searchProcesses(@RequestParam String name) {
        log.info("GET /api/processes/search?name={}", name);
        List<ProcessDTO> processes = processService.searchProcessesByName(name);
        return ResponseEntity.ok(processes);
    }
}

