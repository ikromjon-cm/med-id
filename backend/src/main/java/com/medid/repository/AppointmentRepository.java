package com.medid.repository;

import com.medid.model.Appointment;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class AppointmentRepository {

    private final ConcurrentHashMap<String, Appointment> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public Appointment save(Appointment appointment) {
        if (appointment.getId() == null) {
            appointment.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(appointment.getId(), appointment);
        return appointment;
    }

    public Optional<Appointment> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Appointment> findByPatientId(String patientId) {
        return store.values().stream()
            .filter(a -> a.getPatientId().equals(patientId))
            .toList();
    }

    public List<Appointment> findByDoctorId(String doctorId) {
        return store.values().stream()
            .filter(a -> a.getDoctorId().equals(doctorId))
            .toList();
    }

    public List<Appointment> findByClinicId(String clinicId) {
        return store.values().stream()
            .filter(a -> a.getClinicId() != null && a.getClinicId().equals(clinicId))
            .toList();
    }

    public List<Appointment> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }

    public long countByStatus(Appointment.Status status) {
        return store.values().stream().filter(a -> a.getStatus() == status).count();
    }
}
