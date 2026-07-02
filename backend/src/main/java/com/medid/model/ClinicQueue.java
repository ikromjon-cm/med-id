package com.medid.model;

import java.time.LocalDateTime;

public class ClinicQueue {

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum Status {
        WAITING, WITH_DOCTOR, COMPLETED
    }

    private String id;
    private String clinicId;
    private String patientId;
    private Priority priority;
    private Status status;
    private int waitTimeMinutes;
    private LocalDateTime joinedAt;

    public ClinicQueue() {}

    public ClinicQueue(String id, String clinicId, String patientId, Priority priority, Status status, int waitTimeMinutes) {
        this.id = id;
        this.clinicId = clinicId;
        this.patientId = patientId;
        this.priority = priority;
        this.status = status;
        this.waitTimeMinutes = waitTimeMinutes;
        this.joinedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClinicId() { return clinicId; }
    public void setClinicId(String clinicId) { this.clinicId = clinicId; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public int getWaitTimeMinutes() { return waitTimeMinutes; }
    public void setWaitTimeMinutes(int waitTimeMinutes) { this.waitTimeMinutes = waitTimeMinutes; }
    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
