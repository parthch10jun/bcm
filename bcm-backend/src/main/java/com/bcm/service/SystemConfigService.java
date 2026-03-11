package com.bcm.service;

import com.bcm.dto.BIAConfigDTO;
import com.bcm.dto.OrganizationSettingsDTO;
import com.bcm.entity.SystemConfiguration;
import com.bcm.repository.SystemConfigurationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service for managing system configuration settings
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SystemConfigService {

    private final SystemConfigurationRepository configRepository;
    private final ObjectMapper objectMapper;

    private static final String CATEGORY_ORGANIZATION = "organization";
    private static final String CATEGORY_BIA_CONFIG = "bia_config";

    /**
     * Get organization settings
     */
    public OrganizationSettingsDTO getOrganizationSettings() {
        log.info("Fetching organization settings");
        
        OrganizationSettingsDTO settings = new OrganizationSettingsDTO();
        
        // Load each setting from database
        settings.setName(getConfigValue(CATEGORY_ORGANIZATION, "name", "ADNOC"));
        settings.setLogo(getConfigValue(CATEGORY_ORGANIZATION, "logo", "/adnoc-logo.svg"));
        settings.setPrimaryColor(getConfigValue(CATEGORY_ORGANIZATION, "primaryColor", "#e31837"));
        settings.setSecondaryColor(getConfigValue(CATEGORY_ORGANIZATION, "secondaryColor", "#c41230"));
        settings.setContactEmail(getConfigValue(CATEGORY_ORGANIZATION, "contactEmail", ""));
        settings.setWebsite(getConfigValue(CATEGORY_ORGANIZATION, "website", ""));
        settings.setIndustry(getConfigValue(CATEGORY_ORGANIZATION, "industry", ""));
        settings.setSize(getConfigValue(CATEGORY_ORGANIZATION, "size", ""));
        
        return settings;
    }

    /**
     * Update organization settings
     */
    @Transactional
    public OrganizationSettingsDTO updateOrganizationSettings(OrganizationSettingsDTO settings) {
        log.info("Updating organization settings");
        
        saveConfigValue(CATEGORY_ORGANIZATION, "name", settings.getName(), "string", "Organization name");
        saveConfigValue(CATEGORY_ORGANIZATION, "logo", settings.getLogo(), "string", "Organization logo URL");
        saveConfigValue(CATEGORY_ORGANIZATION, "primaryColor", settings.getPrimaryColor(), "string", "Primary brand color");
        saveConfigValue(CATEGORY_ORGANIZATION, "secondaryColor", settings.getSecondaryColor(), "string", "Secondary brand color");
        saveConfigValue(CATEGORY_ORGANIZATION, "contactEmail", settings.getContactEmail(), "string", "Contact email");
        saveConfigValue(CATEGORY_ORGANIZATION, "website", settings.getWebsite(), "string", "Website URL");
        saveConfigValue(CATEGORY_ORGANIZATION, "industry", settings.getIndustry(), "string", "Industry");
        saveConfigValue(CATEGORY_ORGANIZATION, "size", settings.getSize(), "string", "Organization size");
        
        return settings;
    }

    /**
     * Get BIA configuration
     */
    public BIAConfigDTO getBIAConfig() {
        log.info("Fetching BIA configuration");
        
        try {
            String configJson = getConfigValue(CATEGORY_BIA_CONFIG, "config", null);
            
            if (configJson != null) {
                return objectMapper.readValue(configJson, BIAConfigDTO.class);
            }
            
            // Return default configuration
            return getDefaultBIAConfig();
        } catch (JsonProcessingException e) {
            log.error("Error parsing BIA config JSON", e);
            return getDefaultBIAConfig();
        }
    }

    /**
     * Update BIA configuration
     */
    @Transactional
    public BIAConfigDTO updateBIAConfig(BIAConfigDTO config) {
        log.info("Updating BIA configuration");
        
        try {
            String configJson = objectMapper.writeValueAsString(config);
            saveConfigValue(CATEGORY_BIA_CONFIG, "config", configJson, "json", "BIA configuration settings");
            return config;
        } catch (JsonProcessingException e) {
            log.error("Error serializing BIA config to JSON", e);
            throw new RuntimeException("Failed to save BIA configuration", e);
        }
    }

    /**
     * Get all configurations by category
     */
    public Map<String, String> getConfigsByCategory(String category) {
        List<SystemConfiguration> configs = configRepository.findByCategory(category);
        Map<String, String> result = new HashMap<>();
        
        for (SystemConfiguration config : configs) {
            result.put(config.getConfigKey(), config.getConfigValue());
        }
        
        return result;
    }

    /**
     * Helper method to get a config value with default
     */
    private String getConfigValue(String category, String key, String defaultValue) {
        Optional<SystemConfiguration> config = configRepository.findByCategoryAndConfigKey(category, key);
        return config.map(SystemConfiguration::getConfigValue).orElse(defaultValue);
    }

    /**
     * Helper method to save a config value
     */
    private void saveConfigValue(String category, String key, String value, String dataType, String description) {
        Optional<SystemConfiguration> existingConfig = configRepository.findByCategoryAndConfigKey(category, key);
        
        SystemConfiguration config;
        if (existingConfig.isPresent()) {
            config = existingConfig.get();
            config.setConfigValue(value);
        } else {
            config = new SystemConfiguration();
            config.setCategory(category);
            config.setConfigKey(key);
            config.setConfigValue(value);
            config.setDataType(dataType);
            config.setDescription(description);
            config.setIsEditable(true);
            config.setRequiresAdmin(true);
        }
        
        configRepository.save(config);
    }

    /**
     * Get default BIA configuration
     */
    private BIAConfigDTO getDefaultBIAConfig() {
        BIAConfigDTO config = new BIAConfigDTO();
        
        // Default timeframes
        config.setTimeFrames(List.of(
            new BIAConfigDTO.TimeFrame("1", "1 Hour", 1),
            new BIAConfigDTO.TimeFrame("2", "4 Hours", 4),
            new BIAConfigDTO.TimeFrame("3", "24 Hours", 24),
            new BIAConfigDTO.TimeFrame("4", "3 Days", 72),
            new BIAConfigDTO.TimeFrame("5", "1 Week", 168)
        ));
        
        // Default impact categories
        config.setImpactCategories(List.of(
            new BIAConfigDTO.ImpactCategory("1", "Financial", Map.of(
                0, "No financial impact",
                1, "Less than $10,000 impact",
                2, "$10,000 - $100,000 impact",
                3, "$100,000 - $1,000,000 impact",
                4, ">$1,000,000 or threat to business viability"
            )),
            new BIAConfigDTO.ImpactCategory("2", "Operational", Map.of(
                0, "No operational impact",
                1, "Minimal operational disruption",
                2, "Minor delays in non-critical functions",
                3, "Moderate impact on core operations",
                4, "Complete operational shutdown"
            )),
            new BIAConfigDTO.ImpactCategory("3", "Reputational", Map.of(
                0, "No reputational impact",
                1, "No public awareness or concern",
                2, "Limited local media attention",
                3, "Regional media coverage, customer complaints",
                4, "International coverage, permanent brand damage"
            )),
            new BIAConfigDTO.ImpactCategory("4", "Legal/Regulatory", Map.of(
                0, "No legal or regulatory implications",
                1, "Minor compliance issues, easily resolved",
                2, "Moderate regulatory scrutiny or fines",
                3, "Significant legal action or regulatory penalties",
                4, "Criminal liability or license revocation"
            ))
        ));
        
        config.setCriticalityThreshold(3);
        config.setRtoOptions(List.of("15 minutes", "1 hour", "4 hours", "8 hours", "1 day", "3 days", "1 week"));
        config.setRpoOptions(List.of("0 minutes", "15 minutes", "1 hour", "4 hours", "8 hours", "1 day"));
        
        return config;
    }
}

