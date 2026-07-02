package com.medid.repository;

import com.medid.model.EmergencyAlert;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class EmergencyAlertRepository {

    private final ConcurrentHashMap<String, EmergencyAlert> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public EmergencyAlert save(EmergencyAlert alert) {
        if (alert.getId() == null) {
            alert.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(alert.getId(), alert);
        return alert;
    }

    public Optional<EmergencyAlert> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<EmergencyAlert> findByPatientId(String patientId) {
        return store.values().stream()
            .filter(a -> a.getPatientId().equals(patientId))
            .toList();
    }

    public List<EmergencyAlert> findByStatus(EmergencyAlert.Status status) {
        return store.values().stream()
            .filter(a -> a.getStatus() == status)
            .toList();
    }

    public List<EmergencyAlert> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }

    public long countByStatus(EmergencyAlert.Status status) {
        return store.values().stream().filter(a -> a.getStatus() == status).count();
    }
}
