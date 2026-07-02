package com.medid.service;

import com.medid.model.Prescription;
import com.medid.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository repository;

    public PrescriptionService(PrescriptionRepository repository) {
        this.repository = repository;
    }

    public List<Prescription> findByPatientId(String patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<Prescription> findByDoctorId(String doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    public Prescription findById(String id) {
        return repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Prescription not found: " + id));
    }

    public Prescription create(Prescription prescription) {
        prescription.setCreatedAt(LocalDateTime.now());
        if (prescription.getDate() == null) {
            prescription.setDate(LocalDate.now());
        }
        return repository.save(prescription);
    }

    public Prescription update(String id, Prescription updated) {
        var prescription = findById(id);
        if (updated.getMedicationName() != null) prescription.setMedicationName(updated.getMedicationName());
        if (updated.getDosage() != null) prescription.setDosage(updated.getDosage());
        if (updated.getDuration() != null) prescription.setDuration(updated.getDuration());
        if (updated.getNotes() != null) prescription.setNotes(updated.getNotes());
        return repository.save(prescription);
    }

    public void delete(String id) {
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Prescription not found: " + id);
        }
        repository.deleteById(id);
    }
}
