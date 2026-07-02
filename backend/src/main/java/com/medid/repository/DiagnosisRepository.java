package com.medid.repository;

import com.medid.model.Diagnosis;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class DiagnosisRepository {

    private final ConcurrentHashMap<String, Diagnosis> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public Diagnosis save(Diagnosis diagnosis) {
        if (diagnosis.getId() == null) {
            diagnosis.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(diagnosis.getId(), diagnosis);
        return diagnosis;
    }

    public Optional<Diagnosis> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Diagnosis> findByPatientId(String patientId) {
        return store.values().stream()
            .filter(d -> d.getPatientId().equals(patientId))
            .toList();
    }

    public List<Diagnosis> findByDoctorId(String doctorId) {
        return store.values().stream()
            .filter(d -> d.getDoctorId().equals(doctorId))
            .toList();
    }

    public List<Diagnosis> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }
}
