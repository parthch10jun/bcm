package com.bcm.service;

import com.bcm.entity.*;
import com.bcm.enums.EnablerTypeCode;
import com.bcm.enums.RiskCategoryCode;
import com.bcm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * RiskContextService - Resolves context objects and applicable threats
 * 
 * This is the KEY service that connects:
 * - Risk Categories (what you're assessing)
 * - Context Objects (Process/Location/Vendor/etc.)
 * - Enabler Types (BETH3V resources used by the context)
 * - Threats (what can go wrong)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RiskContextService {

    private final ProcessRepository processRepository;
    private final ProcessAssetRepository processAssetRepository;
    private final ProcessVendorRepository processVendorRepository;
    private final VendorRepository vendorRepository;
    private final OrganizationalUnitRepository organizationalUnitRepository;
    private final ThreatService threatService;

    /**
     * Get applicable threats for a specific context
     * 
     * @param riskCategoryId The risk category ID
     * @param contextType The type of context (PROCESS, LOCATION, VENDOR, etc.)
     * @param contextId The ID of the context object
     * @return List of applicable threats
     */
    @Transactional(readOnly = true)
    public List<Threat> getApplicableThreats(Long riskCategoryId, RiskCategoryCode contextType, Long contextId) {
        log.info("Getting applicable threats for context: {} ID: {}", contextType, contextId);
        
        // Step 1: Get enabler types used by this context
        List<EnablerTypeCode> enablerTypes = getEnablerTypesForContext(contextType, contextId);
        
        log.info("Found {} enabler types for context: {}", enablerTypes.size(), enablerTypes);
        
        // Step 2: Get threats that match both the risk category AND the enabler types
        List<Threat> applicableThreats = threatService.getApplicableThreats(riskCategoryId, enablerTypes);
        
        log.info("Found {} applicable threats", applicableThreats.size());
        return applicableThreats;
    }

    /**
     * Get enabler types for a specific context
     * 
     * This method analyzes the context object and determines which BETH3V
     * enabler types are involved based on dependencies
     */
    @Transactional(readOnly = true)
    public List<EnablerTypeCode> getEnablerTypesForContext(RiskCategoryCode contextType, Long contextId) {
        log.info("Resolving enabler types for context: {} ID: {}", contextType, contextId);
        
        Set<EnablerTypeCode> enablerTypes = new HashSet<>();
        
        switch (contextType) {
            case PROCESS:
                enablerTypes.addAll(getEnablerTypesForProcess(contextId));
                break;
                
            case LOCATION:
                enablerTypes.addAll(getEnablerTypesForLocation(contextId));
                break;
                
            case SUPPLIER:
                enablerTypes.add(EnablerTypeCode.VENDOR);
                break;
                
            case APPLICATION:
                enablerTypes.add(EnablerTypeCode.TECHNOLOGY);
                break;
                
            case ORG_UNIT:
                enablerTypes.addAll(getEnablerTypesForOrgUnit(contextId));
                break;
                
            case ASSET:
                enablerTypes.addAll(getEnablerTypesForAsset(contextId));
                break;
                
            case PROJECT:
                // Projects can involve any enabler type
                enablerTypes.addAll(Arrays.asList(EnablerTypeCode.values()));
                break;
                
            default:
                log.warn("Unknown context type: {}", contextType);
        }
        
        return new ArrayList<>(enablerTypes);
    }

    /**
     * Get enabler types for a Process
     * Analyzes ProcessAsset, ProcessVendor, ProcessVitalRecord, etc.
     */
    private List<EnablerTypeCode> getEnablerTypesForProcess(Long processId) {
        log.info("Analyzing enabler types for Process ID: {}", processId);

        com.bcm.entity.Process process = processRepository.findById(processId)
                .orElseThrow(() -> new RuntimeException("Process not found with id: " + processId));

        Set<EnablerTypeCode> enablerTypes = new HashSet<>();

        // Check ProcessAsset dependencies
        List<ProcessAsset> processAssets = processAssetRepository.findByProcessId(processId);
        if (!processAssets.isEmpty()) {
            // Assets can be EQUIPMENT or TECHNOLOGY
            // For now, we'll add both if assets exist
            enablerTypes.add(EnablerTypeCode.EQUIPMENT);
            enablerTypes.add(EnablerTypeCode.TECHNOLOGY);
            log.info("Process has {} asset dependencies", processAssets.size());
        }

        // Check ProcessVendor dependencies
        List<ProcessVendor> processVendors = processVendorRepository.findByProcessIdAndIsDeletedFalse(processId);
        if (!processVendors.isEmpty()) {
            enablerTypes.add(EnablerTypeCode.VENDOR);
            log.info("Process has {} vendor dependencies", processVendors.size());
        }
        
        // Check ProcessVitalRecord dependencies
        // TODO: Add when ProcessVitalRecord repository is available
        // For now, assume vital records are involved
        enablerTypes.add(EnablerTypeCode.VITAL_RECORD);
        
        // Processes always involve people
        enablerTypes.add(EnablerTypeCode.PEOPLE);
        
        // Processes are typically located in buildings
        enablerTypes.add(EnablerTypeCode.BUILDING);
        
        log.info("Process enabler types: {}", enablerTypes);
        return new ArrayList<>(enablerTypes);
    }

    /**
     * Get enabler types for a Location
     */
    private List<EnablerTypeCode> getEnablerTypesForLocation(Long locationId) {
        log.info("Analyzing enabler types for Location ID: {}", locationId);
        
        Set<EnablerTypeCode> enablerTypes = new HashSet<>();
        
        // Locations always involve buildings
        enablerTypes.add(EnablerTypeCode.BUILDING);
        
        // Locations typically have equipment, technology, and people
        enablerTypes.add(EnablerTypeCode.EQUIPMENT);
        enablerTypes.add(EnablerTypeCode.TECHNOLOGY);
        enablerTypes.add(EnablerTypeCode.PEOPLE);
        enablerTypes.add(EnablerTypeCode.VITAL_RECORD);
        
        // Could also involve vendors (e.g., facility management)
        enablerTypes.add(EnablerTypeCode.VENDOR);
        
        log.info("Location enabler types: {}", enablerTypes);
        return new ArrayList<>(enablerTypes);
    }

    /**
     * Get enabler types for an Organizational Unit
     */
    private List<EnablerTypeCode> getEnablerTypesForOrgUnit(Long orgUnitId) {
        log.info("Analyzing enabler types for Org Unit ID: {}", orgUnitId);

        OrganizationalUnit orgUnit = organizationalUnitRepository.findById(orgUnitId)
                .orElseThrow(() -> new RuntimeException("Organizational unit not found with id: " + orgUnitId));

        Set<EnablerTypeCode> enablerTypes = new HashSet<>();

        // Org units always involve people
        enablerTypes.add(EnablerTypeCode.PEOPLE);

        // Get all processes for this org unit
        List<com.bcm.entity.Process> processes = processRepository.findByOrganizationalUnitId(orgUnitId);

        if (!processes.isEmpty()) {
            log.info("Org unit has {} processes", processes.size());

            // Aggregate enabler types from all processes
            for (com.bcm.entity.Process process : processes) {
                enablerTypes.addAll(getEnablerTypesForProcess(process.getId()));
            }
        } else {
            // Default enabler types for org units without processes
            enablerTypes.add(EnablerTypeCode.BUILDING);
            enablerTypes.add(EnablerTypeCode.EQUIPMENT);
            enablerTypes.add(EnablerTypeCode.TECHNOLOGY);
            enablerTypes.add(EnablerTypeCode.VITAL_RECORD);
        }

        log.info("Org unit enabler types: {}", enablerTypes);
        return new ArrayList<>(enablerTypes);
    }

    /**
     * Get enabler types for an Asset
     */
    private List<EnablerTypeCode> getEnablerTypesForAsset(Long assetId) {
        log.info("Analyzing enabler types for Asset ID: {}", assetId);
        
        Set<EnablerTypeCode> enablerTypes = new HashSet<>();
        
        // Assets are either EQUIPMENT or TECHNOLOGY
        // For now, add both
        enablerTypes.add(EnablerTypeCode.EQUIPMENT);
        enablerTypes.add(EnablerTypeCode.TECHNOLOGY);
        
        log.info("Asset enabler types: {}", enablerTypes);
        return new ArrayList<>(enablerTypes);
    }

    /**
     * Get context object details
     * Returns a map with context information for display
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getContextDetails(RiskCategoryCode contextType, Long contextId) {
        log.info("Getting context details for: {} ID: {}", contextType, contextId);
        
        Map<String, Object> details = new HashMap<>();
        details.put("contextType", contextType);
        details.put("contextId", contextId);
        
        switch (contextType) {
            case PROCESS:
                com.bcm.entity.Process process = processRepository.findById(contextId)
                        .orElseThrow(() -> new RuntimeException("Process not found"));
                details.put("name", process.getProcessName());
                details.put("code", process.getProcessCode());
                details.put("description", process.getDescription());
                details.put("isCritical", process.getIsCritical());
                break;

            case SUPPLIER:
                Vendor vendor = vendorRepository.findById(contextId)
                        .orElseThrow(() -> new RuntimeException("Vendor not found"));
                details.put("name", vendor.getVendorName());
                details.put("description", vendor.getDescription());
                // Vendor doesn't have criticality field
                break;
                
            case ORG_UNIT:
                OrganizationalUnit orgUnit = organizationalUnitRepository.findById(contextId)
                        .orElseThrow(() -> new RuntimeException("Organizational unit not found"));
                details.put("name", orgUnit.getUnitName());
                details.put("code", orgUnit.getUnitCode());
                details.put("type", orgUnit.getUnitType());
                break;
                
            // Add other context types as needed
            default:
                details.put("name", "Unknown");
        }
        
        return details;
    }
}

