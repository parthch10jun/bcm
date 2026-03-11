package com.bcm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for BCM Platform
 * Business Continuity Management Platform - Backend API
 */
@SpringBootApplication
@EnableJpaAuditing
public class BcmPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(BcmPlatformApplication.class, args);
    }
}

