package com.medid.model;

import java.time.LocalDateTime;

public class Appointment {

    public enum Status {
        UPCOMING, COMPLETED, CANCELLED
    }

    private String id;
    private String patientId;
    private String doctorId;
    private String clinicId;
    private LocalDateTime dateTime;
    private Status status;
    private String type;
    private String notes;
    private LocalDateTime createdAt;

    public Appointment() {}

    public Appointment(String id, String patientId, String doctorId, String clinicId, LocalDateTime dateTime, Status status, String type, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.clinicId = clinicId;
        this.dateTime = dateTime;
        this.status = status;
        this.type = type;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
    public String getClinicId() { return clinicId; }
    public void setClinicId(String clinicId) { this.clinicId = clinicId; }
    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
