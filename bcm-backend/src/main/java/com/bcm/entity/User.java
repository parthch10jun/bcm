package com.bcm.entity;

import com.bcm.enums.UserRole;
import com.bcm.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * User entity representing employees and personnel
 * Part of the BETH3V framework - Human Resources (People Library)
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "job_title")
    private String jobTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    @Builder.Default
    private UserRole userRole = UserRole.USER;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizational_unit_id")
    private OrganizationalUnit organizationalUnit;

    @Column(name = "hrms_employee_id", unique = true)
    private String hrmsEmployeeId;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;
}

