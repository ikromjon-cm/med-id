package com.medid.model;

import java.time.LocalDateTime;

public class EmergencyAlert {

    public enum Status {
        ACTIVE, RESOLVED
    }

    private String id;
    private String patientId;
    private String triggeredBy;
    private Status status;
    private LocalDateTime accessedAt;
    private LocalDateTime resolvedAt;
    private String staffId;
    private String notes;

    public EmergencyAlert() {}

    public EmergencyAlert(String id, String patientId, String triggeredBy, Status status, String staffId, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.triggeredBy = triggeredBy;
        this.status = status;
        this.accessedAt = LocalDateTime.now();
        this.staffId = staffId;
        this.notes = notes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getTriggeredBy() { return triggeredBy; }
    public void setTriggeredBy(String triggeredBy) { this.triggeredBy = triggeredBy; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getAccessedAt() { return accessedAt; }
    public void setAccessedAt(LocalDateTime accessedAt) { this.accessedAt = accessedAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
