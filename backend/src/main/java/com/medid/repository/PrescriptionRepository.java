package com.medid.repository;

import com.medid.model.Prescription;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class PrescriptionRepository {

    private final ConcurrentHashMap<String, Prescription> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public Prescription save(Prescription prescription) {
        if (prescription.getId() == null) {
            prescription.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(prescription.getId(), prescription);
        return prescription;
    }

    public Optional<Prescription> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Prescription> findByPatientId(String patientId) {
        return store.values().stream()
            .filter(p -> p.getPatientId().equals(patientId))
            .toList();
    }

    public List<Prescription> findByDoctorId(String doctorId) {
        return store.values().stream()
            .filter(p -> p.getDoctorId().equals(doctorId))
            .toList();
    }

    public List<Prescription> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }
}
