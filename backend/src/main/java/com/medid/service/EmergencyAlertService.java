package com.medid.service;

import com.medid.model.EmergencyAlert;
import com.medid.repository.EmergencyAlertRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class EmergencyAlertService {

    private final EmergencyAlertRepository repository;

    public EmergencyAlertService(EmergencyAlertRepository repository) {
        this.repository = repository;
    }

    public List<EmergencyAlert> getActiveAlerts() {
        return repository.findByStatus(EmergencyAlert.Status.ACTIVE);
    }

    public List<EmergencyAlert> findAll() {
        return repository.findAll();
    }

    public EmergencyAlert findById(String id) {
        return repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Emergency alert not found: " + id));
    }

    public EmergencyAlert createAlert(EmergencyAlert alert) {
        alert.setAccessedAt(LocalDateTime.now());
        if (alert.getStatus() == null) {
            alert.setStatus(EmergencyAlert.Status.ACTIVE);
        }
        return repository.save(alert);
    }

    public EmergencyAlert resolveAlert(String id, String staffId, String notes) {
        var alert = findById(id);
        alert.setStatus(EmergencyAlert.Status.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        alert.setStaffId(staffId);
        if (notes != null) alert.setNotes(notes);
        return repository.save(alert);
    }

    public Map<String, Object> getStats() {
        var total = repository.count();
        var active = repository.countByStatus(EmergencyAlert.Status.ACTIVE);
        var resolved = repository.countByStatus(EmergencyAlert.Status.RESOLVED);
        return Map.of(
            "totalAlerts", total,
            "activeAlerts", active,
            "resolvedAlerts", resolved
        );
    }
}
