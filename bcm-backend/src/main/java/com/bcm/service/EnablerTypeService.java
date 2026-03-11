package com.bcm.service;

import com.bcm.entity.EnablerType;
import com.bcm.enums.EnablerTypeCode;
import com.bcm.repository.EnablerTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for EnablerType management (BETH3V framework)
 * 
 * NOTE: EnablerTypes are typically seeded data and rarely modified
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EnablerTypeService {

    private final EnablerTypeRepository enablerTypeRepository;

    /**
     * Get all enabler types
     */
    @Transactional(readOnly = true)
    public List<EnablerType> getAllEnablerTypes() {
        log.info("Fetching all enabler types");
        return enablerTypeRepository.findByIsDeletedFalseOrderByDisplayOrderAsc();
    }

    /**
     * Get enabler type by ID
     */
    @Transactional(readOnly = true)
    public EnablerType getEnablerTypeById(Long id) {
        log.info("Fetching enabler type with ID: {}", id);
        EnablerType enablerType = enablerTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enabler type not found with id: " + id));
        
        if (enablerType.getIsDeleted()) {
            throw new RuntimeException("Enabler type has been deleted");
        }
        
        return enablerType;
    }

    /**
     * Get enabler type by code
     */
    @Transactional(readOnly = true)
    public EnablerType getEnablerTypeByCode(EnablerTypeCode code) {
        log.info("Fetching enabler type with code: {}", code);
        return enablerTypeRepository.findByCodeAndIsDeletedFalse(code)
                .orElseThrow(() -> new RuntimeException("Enabler type not found with code: " + code));
    }

    /**
     * Initialize BETH3V enabler types (called on application startup)
     */
    @Transactional
    public void initializeEnablerTypes() {
        log.info("Initializing BETH3V enabler types");
        
        int displayOrder = 1;
        for (EnablerTypeCode code : EnablerTypeCode.values()) {
            if (!enablerTypeRepository.existsByCodeAndIsDeletedFalse(code)) {
                EnablerType enablerType = EnablerType.builder()
                        .code(code)
                        .name(code.getDisplayName())
                        .description(code.getDescription())
                        .displayOrder(displayOrder++)
                        .build();
                enablerTypeRepository.save(enablerType);
                log.info("Created enabler type: {}", code);
            }
        }
        
        log.info("BETH3V enabler types initialized successfully");
    }
}

