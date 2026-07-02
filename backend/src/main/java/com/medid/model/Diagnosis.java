package com.medid.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Diagnosis {

    private String id;
    private String patientId;
    private String doctorId;
    private String title;
    private String description;
    private String icdCode;
    private LocalDate date;
    private LocalDateTime createdAt;

    public Diagnosis() {}

    public Diagnosis(String id, String patientId, String doctorId, String title, String description, String icdCode, LocalDate date) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.title = title;
        this.description = description;
        this.icdCode = icdCode;
        this.date = date;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcdCode() { return icdCode; }
    public void setIcdCode(String icdCode) { this.icdCode = icdCode; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
