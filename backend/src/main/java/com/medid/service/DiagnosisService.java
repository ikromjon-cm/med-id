package com.medid.service;

import com.medid.model.Diagnosis;
import com.medid.repository.DiagnosisRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiagnosisService {

    private final DiagnosisRepository repository;

    public DiagnosisService(DiagnosisRepository repository) {
        this.repository = repository;
    }

    public List<Diagnosis> findByPatientId(String patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<Diagnosis> findByDoctorId(String doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    public Diagnosis findById(String id) {
        return repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Diagnosis not found: " + id));
    }

    public Diagnosis create(Diagnosis diagnosis) {
        diagnosis.setCreatedAt(LocalDateTime.now());
        if (diagnosis.getDate() == null) {
            diagnosis.setDate(LocalDate.now());
        }
        return repository.save(diagnosis);
    }

    public Diagnosis update(String id, Diagnosis updated) {
        var diagnosis = findById(id);
        if (updated.getTitle() != null) diagnosis.setTitle(updated.getTitle());
        if (updated.getDescription() != null) diagnosis.setDescription(updated.getDescription());
        if (updated.getIcdCode() != null) diagnosis.setIcdCode(updated.getIcdCode());
        if (updated.getDate() != null) diagnosis.setDate(updated.getDate());
        return repository.save(diagnosis);
    }

    public void delete(String id) {
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Diagnosis not found: " + id);
        }
        repository.deleteById(id);
    }
}
