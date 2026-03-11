package com.bcm.service;

import com.bcm.dto.VendorDTO;
import com.bcm.entity.Vendor;
import com.bcm.enums.ServiceType;
import com.bcm.enums.VendorStatus;
import com.bcm.repository.AssetVendorRepository;
import com.bcm.repository.ProcessVendorRepository;
import com.bcm.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Vendors
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VendorService {

    private final VendorRepository vendorRepository;
    private final ProcessVendorRepository processVendorRepository;
    private final AssetVendorRepository assetVendorRepository;

    /**
     * Get all vendors (not deleted)
     */
    @Transactional(readOnly = true)
    public List<VendorDTO> getAllVendors() {
        log.info("Fetching all vendors");
        return vendorRepository.findByIsDeletedFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get vendor by ID
     */
    @Transactional(readOnly = true)
    public VendorDTO getVendorById(Long id) {
        log.info("Fetching vendor with ID: {}", id);
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));
        
        if (vendor.getIsDeleted()) {
            throw new RuntimeException("Vendor has been deleted");
        }
        
        return convertToDTO(vendor);
    }

    /**
     * Get vendors by status
     */
    @Transactional(readOnly = true)
    public List<VendorDTO> getVendorsByStatus(VendorStatus status) {
        log.info("Fetching vendors with status: {}", status);
        return vendorRepository.findByStatusAndIsDeletedFalse(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get vendors by service type
     */
    @Transactional(readOnly = true)
    public List<VendorDTO> getVendorsByServiceType(ServiceType serviceType) {
        log.info("Fetching vendors with service type: {}", serviceType);
        return vendorRepository.findByServiceTypeAndIsDeletedFalse(serviceType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search vendors by name
     */
    @Transactional(readOnly = true)
    public List<VendorDTO> searchVendorsByName(String name) {
        log.info("Searching vendors with name containing: {}", name);
        return vendorRepository.findByVendorNameContainingIgnoreCaseAndIsDeletedFalse(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new vendor
     */
    @Transactional
    public VendorDTO createVendor(VendorDTO vendorDTO) {
        log.info("Creating new vendor: {}", vendorDTO.getVendorName());
        
        Vendor vendor = new Vendor();
        vendor.setVendorName(vendorDTO.getVendorName());
        vendor.setStatus(vendorDTO.getStatus() != null ? vendorDTO.getStatus() : VendorStatus.ACTIVE);
        vendor.setServiceType(vendorDTO.getServiceType());
        vendor.setDescription(vendorDTO.getDescription());
        vendor.setContactName(vendorDTO.getContactName());
        vendor.setContactEmail(vendorDTO.getContactEmail());
        vendor.setContactPhone(vendorDTO.getContactPhone());
        vendor.setRecoveryTimeCapability(vendorDTO.getRecoveryTimeCapability());
        vendor.setContractStartDate(vendorDTO.getContractStartDate());
        vendor.setContractEndDate(vendorDTO.getContractEndDate());
        vendor.setWebsite(vendorDTO.getWebsite());
        vendor.setAddress(vendorDTO.getAddress());
        vendor.setNotes(vendorDTO.getNotes());
        
        Vendor savedVendor = vendorRepository.save(vendor);
        log.info("Vendor created successfully with ID: {}", savedVendor.getId());
        
        return convertToDTO(savedVendor);
    }

    /**
     * Update an existing vendor
     */
    @Transactional
    public VendorDTO updateVendor(Long id, VendorDTO vendorDTO) {
        log.info("Updating vendor with ID: {}", id);
        
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));
        
        if (vendor.getIsDeleted()) {
            throw new RuntimeException("Cannot update deleted vendor");
        }
        
        vendor.setVendorName(vendorDTO.getVendorName());
        vendor.setStatus(vendorDTO.getStatus());
        vendor.setServiceType(vendorDTO.getServiceType());
        vendor.setDescription(vendorDTO.getDescription());
        vendor.setContactName(vendorDTO.getContactName());
        vendor.setContactEmail(vendorDTO.getContactEmail());
        vendor.setContactPhone(vendorDTO.getContactPhone());
        vendor.setRecoveryTimeCapability(vendorDTO.getRecoveryTimeCapability());
        vendor.setContractStartDate(vendorDTO.getContractStartDate());
        vendor.setContractEndDate(vendorDTO.getContractEndDate());
        vendor.setWebsite(vendorDTO.getWebsite());
        vendor.setAddress(vendorDTO.getAddress());
        vendor.setNotes(vendorDTO.getNotes());
        
        Vendor updatedVendor = vendorRepository.save(vendor);
        log.info("Vendor updated successfully");
        
        return convertToDTO(updatedVendor);
    }

    /**
     * Soft delete a vendor
     */
    @Transactional
    public void deleteVendor(Long id) {
        log.info("Soft deleting vendor with ID: {}", id);
        
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));
        
        vendor.setIsDeleted(true);
        vendorRepository.save(vendor);
        
        log.info("Vendor soft deleted successfully");
    }

    /**
     * Convert Vendor entity to DTO
     */
    private VendorDTO convertToDTO(Vendor vendor) {
        VendorDTO dto = new VendorDTO();
        dto.setId(vendor.getId());
        dto.setVendorName(vendor.getVendorName());
        dto.setStatus(vendor.getStatus());
        dto.setServiceType(vendor.getServiceType());
        dto.setDescription(vendor.getDescription());
        dto.setContactName(vendor.getContactName());
        dto.setContactEmail(vendor.getContactEmail());
        dto.setContactPhone(vendor.getContactPhone());
        dto.setRecoveryTimeCapability(vendor.getRecoveryTimeCapability());
        dto.setContractStartDate(vendor.getContractStartDate());
        dto.setContractEndDate(vendor.getContractEndDate());
        dto.setWebsite(vendor.getWebsite());
        dto.setAddress(vendor.getAddress());
        dto.setNotes(vendor.getNotes());
        dto.setCreatedAt(vendor.getCreatedAt());
        dto.setUpdatedAt(vendor.getUpdatedAt());
        
        // Calculate relationship counts
        Long processCount = processVendorRepository.countByVendorIdAndIsDeletedFalse(vendor.getId());
        Long assetCount = assetVendorRepository.countByVendorIdAndIsDeletedFalse(vendor.getId());
        
        dto.setProcessCount(processCount);
        dto.setAssetCount(assetCount);
        
        return dto;
    }
}

