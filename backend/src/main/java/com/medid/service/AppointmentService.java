package com.medid.service;

import com.medid.model.Appointment;
import com.medid.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public List<Appointment> findByPatientId(String patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<Appointment> findByDoctorId(String doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    public List<Appointment> findByClinicId(String clinicId) {
        return repository.findByClinicId(clinicId);
    }

    public Appointment findById(String id) {
        return repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Appointment not found: " + id));
    }

    public Appointment create(Appointment appointment) {
        appointment.setCreatedAt(LocalDateTime.now());
        if (appointment.getStatus() == null) {
            appointment.setStatus(Appointment.Status.UPCOMING);
        }
        return repository.save(appointment);
    }

    public Appointment updateStatus(String id, Appointment.Status status) {
        var appointment = findById(id);
        appointment.setStatus(status);
        return repository.save(appointment);
    }

    public Appointment update(String id, Appointment updated) {
        var appointment = findById(id);
        if (updated.getDateTime() != null) appointment.setDateTime(updated.getDateTime());
        if (updated.getStatus() != null) appointment.setStatus(updated.getStatus());
        if (updated.getType() != null) appointment.setType(updated.getType());
        if (updated.getNotes() != null) appointment.setNotes(updated.getNotes());
        return repository.save(appointment);
    }

    public void delete(String id) {
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Appointment not found: " + id);
        }
        repository.deleteById(id);
    }
}
