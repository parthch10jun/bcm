package com.bcm.repository;

import com.bcm.entity.SystemConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemConfigurationRepository extends JpaRepository<SystemConfiguration, Long> {
    
    /**
     * Find configuration by category and key
     */
    Optional<SystemConfiguration> findByCategoryAndConfigKey(String category, String configKey);
    
    /**
     * Find all configurations in a category
     */
    List<SystemConfiguration> findByCategory(String category);
    
    /**
     * Find all editable configurations
     */
    List<SystemConfiguration> findByIsEditableTrue();
    
    /**
     * Find all admin-only configurations
     */
    List<SystemConfiguration> findByRequiresAdminTrue();
}

