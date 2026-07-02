package com.medid.service;

import com.medid.dto.DashboardStatsDto;
import com.medid.dto.UserDto;
import com.medid.model.Role;
import com.medid.model.User;
import com.medid.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final NotificationRepository notificationRepository;
    private final AccessLogRepository accessLogRepository;
    private final MedicalProfileRepository medicalProfileRepository;

    public AdminService(UserRepository userRepository,
                        DocumentRepository documentRepository,
                        EmergencyContactRepository emergencyContactRepository,
                        NotificationRepository notificationRepository,
                        AccessLogRepository accessLogRepository,
                        MedicalProfileRepository medicalProfileRepository) {
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.emergencyContactRepository = emergencyContactRepository;
        this.notificationRepository = notificationRepository;
        this.accessLogRepository = accessLogRepository;
        this.medicalProfileRepository = medicalProfileRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        return new DashboardStatsDto(
            userRepository.count(),
            userRepository.countByRole(Role.PATIENT),
            userRepository.countByRole(Role.DOCTOR),
            userRepository.countByRole(Role.CLINIC),
            documentRepository.count(),
            emergencyContactRepository.count(),
            notificationRepository.count(),
            accessLogRepository.count()
        );
    }

    public List<Map<String, Object>> getUsersGrowth() {
        return List.of(
            Map.of("month", "Jan", "users", 5),
            Map.of("month", "Feb", "users", 8),
            Map.of("month", "Mar", "users", 12),
            Map.of("month", "Apr", "users", 15),
            Map.of("month", "May", "users", 20),
            Map.of("month", "Jun", "users", 25)
        );
    }

    public List<Map<String, Object>> getEmergencyAccess() {
        return List.of(
            Map.of("month", "Jan", "accesses", 2),
            Map.of("month", "Feb", "accesses", 4),
            Map.of("month", "Mar", "accesses", 6),
            Map.of("month", "Apr", "accesses", 8),
            Map.of("month", "May", "accesses", 10),
            Map.of("month", "Jun", "accesses", 15)
        );
    }

    public List<Map<String, Object>> getDocuments() {
        return List.of(
            Map.of("month", "Jan", "documents", 10),
            Map.of("month", "Feb", "documents", 25),
            Map.of("month", "Mar", "documents", 40),
            Map.of("month", "Apr", "documents", 55),
            Map.of("month", "May", "documents", 70),
            Map.of("month", "Jun", "documents", 90)
        );
    }

    public List<Map<String, Object>> getRoles() {
        return List.of(
            Map.of("role", "Patients", "count", userRepository.countByRole(Role.PATIENT)),
            Map.of("role", "Doctors", "count", userRepository.countByRole(Role.DOCTOR)),
            Map.of("role", "Clinics", "count", userRepository.countByRole(Role.CLINIC)),
            Map.of("role", "Admins", "count", userRepository.countByRole(Role.ADMIN)),
            Map.of("role", "Emergency", "count", userRepository.countByRole(Role.EMERGENCY_RESPONDER))
        );
    }

    public List<Map<String, Object>> getInsuranceExpiry() {
        return userRepository.findByRole(Role.PATIENT).stream()
            .map(u -> {
                var profile = medicalProfileRepository.findByUserId(u.getId());
                var daysRemaining = 30;
                var expired = false;
                return Map.<String, Object>of(
                    "userId", u.getId(),
                    "name", u.getName(),
                    "phone", u.getPhone(),
                    "insuranceProvider", profile.map(p -> p.getInsuranceProvider()).orElse("N/A"),
                    "insuranceNumber", profile.map(p -> p.getInsuranceNumber()).orElse("N/A"),
                    "daysRemaining", daysRemaining,
                    "expired", expired
                );
            })
            .toList();
    }

    public Map<String, Object> getAccessStats() {
        var totalAccessLogs = accessLogRepository.count();
        var logs = accessLogRepository.findAll();
        var emergencyActions = logs.stream().filter(l -> "EMERGENCY_ACCESS".equals(l.getAction())).count();
        var biometricLogins = logs.stream().filter(l -> "BIOMETRIC_LOGIN".equals(l.getAction())).count();
        var profileViews = logs.stream().filter(l -> "Medical profile viewed".equals(l.getAction())).count();
        return Map.of(
            "totalAccessLogs", totalAccessLogs,
            "emergencyAccesses", emergencyActions,
            "biometricLogins", biometricLogins,
            "profileViews", profileViews
        );
    }
}
