package com.bcm.repository;

import com.bcm.entity.OrganizationalUnit;
import com.bcm.enums.UnitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for OrganizationalUnit entity
 * Provides database access methods for organizational units
 */
@Repository
public interface OrganizationalUnitRepository extends JpaRepository<OrganizationalUnit, Long> {

    /**
     * Find all top-level organizational units (no parent)
     */
    List<OrganizationalUnit> findByParentUnitIsNull();

    /**
     * Find all child units of a specific parent
     */
    List<OrganizationalUnit> findByParentUnitId(Long parentUnitId);

    /**
     * Find organizational unit by code
     */
    Optional<OrganizationalUnit> findByUnitCode(String unitCode);

    /**
     * Find all units of a specific type
     */
    List<OrganizationalUnit> findByUnitType(UnitType unitType);

    /**
     * REMOVED: findByIsBiaEligibleTrue() - isBiaEligible column no longer exists
     *
     * NEW ARCHITECTURE: BIAs can be created for any unit at any level.
     * The concept of "BIA-eligible" units is deprecated.
     */

    /**
     * Find all operational-level units (units with no subordinate units)
     * @deprecated This method is kept for backward compatibility but is no longer used for BIA eligibility
     */
    @Deprecated
    @Query("SELECT u FROM OrganizationalUnit u WHERE u.id NOT IN " +
           "(SELECT DISTINCT p.id FROM OrganizationalUnit p JOIN p.childUnits c)")
    List<OrganizationalUnit> findAllOperationalLevelUnits();

    /**
     * Legacy method for backward compatibility
     * @deprecated Use findAllOperationalLevelUnits() instead
     */
    @Deprecated
    default List<OrganizationalUnit> findAllLeafNodes() {
        return findAllOperationalLevelUnits();
    }

    /**
     * Find all units by name (case-insensitive, partial match)
     */
    @Query("SELECT u FROM OrganizationalUnit u WHERE LOWER(u.unitName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<OrganizationalUnit> searchByName(@Param("name") String name);

    /**
     * Check if a unit code already exists
     */
    boolean existsByUnitCode(String unitCode);

    /**
     * Find all units with a specific criticality tier
     */
    @Query("SELECT u FROM OrganizationalUnit u WHERE u.criticalityTier = :tier")
    List<OrganizationalUnit> findByCriticalityTier(@Param("tier") String tier);

    /**
     * Get all descendants of a unit (recursive)
     */
    @Query("SELECT u FROM OrganizationalUnit u WHERE u.parentUnit.id = :parentId")
    List<OrganizationalUnit> findDirectChildren(@Param("parentId") Long parentId);

    /**
     * Count total units
     */
    @Query("SELECT COUNT(u) FROM OrganizationalUnit u")
    long countAllUnits();

    /**
     * Count BIA-eligible units (operational-level units)
     */
    @Query("SELECT COUNT(u) FROM OrganizationalUnit u WHERE u.id NOT IN " +
           "(SELECT DISTINCT p.id FROM OrganizationalUnit p JOIN p.childUnits c)")
    long countOperationalLevelUnits();

    /**
     * Legacy method for backward compatibility
     * @deprecated Use countOperationalLevelUnits() instead
     */
    @Deprecated
    default long countLeafNodes() {
        return countOperationalLevelUnits();
    }

    /**
     * Find units by parent unit and type
     */
    List<OrganizationalUnit> findByParentUnitIdAndUnitType(Long parentUnitId, UnitType unitType);

    /**
     * Check if unit has any children
     */
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
           "FROM OrganizationalUnit u JOIN u.childUnits c WHERE u.id = :unitId")
    boolean hasChildren(@Param("unitId") Long unitId);

    /**
     * Find all units that are not deleted (soft delete support)
     */
    List<OrganizationalUnit> findByIsDeletedFalse();

    /**
     * Find top-level units that are not deleted
     */
    List<OrganizationalUnit> findByParentUnitIsNullAndIsDeletedFalse();

    /**
     * Find all top-level units (alias for findByParentUnitIsNull)
     */
    default List<OrganizationalUnit> findTopLevelUnits() {
        return findByParentUnitIsNull();
    }

    /**
     * Check if a unit with the same name exists under the same parent
     * Used to enforce uniqueness of unit names within the same parent
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
           "FROM OrganizationalUnit u " +
           "WHERE u.unitName = :unitName " +
           "AND (:parentUnitId IS NULL AND u.parentUnit IS NULL OR u.parentUnit.id = :parentUnitId) " +
           "AND u.isDeleted = false")
    boolean existsByUnitNameAndParentUnitId(
        @Param("unitName") String unitName,
        @Param("parentUnitId") Long parentUnitId);

    /**
     * Check if a unit with the same name exists under the same parent, excluding a specific unit ID
     * Used for update operations to allow keeping the same name
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
           "FROM OrganizationalUnit u " +
           "WHERE u.unitName = :unitName " +
           "AND (:parentUnitId IS NULL AND u.parentUnit IS NULL OR u.parentUnit.id = :parentUnitId) " +
           "AND u.id != :excludeId " +
           "AND u.isDeleted = false")
    boolean existsByUnitNameAndParentUnitIdExcludingId(
        @Param("unitName") String unitName,
        @Param("parentUnitId") Long parentUnitId,
        @Param("excludeId") Long excludeId);

    /**
     * Get all descendant IDs of a unit (for circular dependency check)
     * This recursively finds all children, grandchildren, etc.
     */
    @Query(value = "WITH RECURSIVE descendants(descendant_id) AS (" +
           "  SELECT id FROM organizational_units WHERE parent_unit_id = :unitId " +
           "  UNION ALL " +
           "  SELECT ou.id FROM organizational_units ou " +
           "  INNER JOIN descendants d ON ou.parent_unit_id = d.descendant_id" +
           ") SELECT descendant_id FROM descendants", nativeQuery = true)
    List<Long> findAllDescendantIds(@Param("unitId") Long unitId);
}

