package com.bcm.repository;

import com.bcm.entity.User;
import com.bcm.enums.UserRole;
import com.bcm.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by HRMS employee ID
     */
    Optional<User> findByHrmsEmployeeId(String hrmsEmployeeId);

    /**
     * Find all users by organizational unit
     */
    List<User> findByOrganizationalUnitId(Long organizationalUnitId);

    /**
     * Find all users by status
     */
    List<User> findByStatus(UserStatus status);

    /**
     * Find all users by user role (RBAC)
     */
    List<User> findByUserRole(UserRole userRole);

    /**
     * Find all users by job title
     */
    List<User> findByJobTitle(String jobTitle);

    /**
     * Search users by name (case-insensitive, partial match)
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> searchByName(@Param("name") String name);

    /**
     * Check if email already exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if HRMS employee ID already exists
     */
    boolean existsByHrmsEmployeeId(String hrmsEmployeeId);

    /**
     * Find all users not deleted
     */
    List<User> findByIsDeletedFalse();

    /**
     * Find all users by organizational unit (not deleted)
     */
    @Query("SELECT u FROM User u WHERE u.organizationalUnit.id = :unitId AND u.isDeleted = false")
    List<User> findActiveUsersByUnit(@Param("unitId") Long unitId);

    /**
     * Count users without organizational unit
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.organizationalUnit IS NULL AND u.isDeleted = false")
    long countUsersWithoutUnit();

    /**
     * Count users with organizational unit
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.organizationalUnit IS NOT NULL AND u.isDeleted = false")
    long countUsersWithUnit();

    /**
     * Count all active users
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.isDeleted = false")
    long countAllUsers();
}

