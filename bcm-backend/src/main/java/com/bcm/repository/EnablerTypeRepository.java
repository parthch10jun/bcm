package com.bcm.repository;

import com.bcm.entity.EnablerType;
import com.bcm.enums.EnablerTypeCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for EnablerType entity
 */
@Repository
public interface EnablerTypeRepository extends JpaRepository<EnablerType, Long> {

    /**
     * Find all non-deleted enabler types
     */
    List<EnablerType> findByIsDeletedFalseOrderByDisplayOrderAsc();

    /**
     * Find enabler type by code
     */
    Optional<EnablerType> findByCodeAndIsDeletedFalse(EnablerTypeCode code);

    /**
     * Check if enabler type exists by code
     */
    boolean existsByCodeAndIsDeletedFalse(EnablerTypeCode code);
}

