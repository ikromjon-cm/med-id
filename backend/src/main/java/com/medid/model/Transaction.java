package com.medid.model;

import java.time.LocalDateTime;

public class Transaction {

    public enum Type {
        PAYMENT, REFUND
    }

    public enum Status {
        PENDING, COMPLETED, FAILED
    }

    private String id;
    private String clinicId;
    private String patientId;
    private double amount;
    private Type type;
    private Status status;
    private String description;
    private LocalDateTime createdAt;

    public Transaction() {}

    public Transaction(String id, String clinicId, String patientId, double amount, Type type, Status status, String description) {
        this.id = id;
        this.clinicId = clinicId;
        this.patientId = patientId;
        this.amount = amount;
        this.type = type;
        this.status = status;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClinicId() { return clinicId; }
    public void setClinicId(String clinicId) { this.clinicId = clinicId; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
