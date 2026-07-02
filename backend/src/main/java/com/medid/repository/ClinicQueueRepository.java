package com.medid.repository;

import com.medid.model.ClinicQueue;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class ClinicQueueRepository {

    private final ConcurrentHashMap<String, ClinicQueue> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public ClinicQueue save(ClinicQueue entry) {
        if (entry.getId() == null) {
            entry.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(entry.getId(), entry);
        return entry;
    }

    public Optional<ClinicQueue> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<ClinicQueue> findByClinicId(String clinicId) {
        return store.values().stream()
            .filter(q -> q.getClinicId().equals(clinicId))
            .sorted(Comparator.comparingInt(q -> q.getPriority().ordinal()))
            .toList();
    }

    public List<ClinicQueue> findByPatientId(String patientId) {
        return store.values().stream()
            .filter(q -> q.getPatientId().equals(patientId))
            .toList();
    }

    public List<ClinicQueue> findByClinicIdAndStatus(String clinicId, ClinicQueue.Status status) {
        return store.values().stream()
            .filter(q -> q.getClinicId().equals(clinicId) && q.getStatus() == status)
            .sorted(Comparator.comparingInt(q -> q.getPriority().ordinal()))
            .toList();
    }

    public List<ClinicQueue> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }
}
