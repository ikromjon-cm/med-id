package com.medid.model;

import java.time.LocalDateTime;

public class MedicalProfile {

    private String id;
    private String userId;
    private String bloodType;
    private String allergies;
    private String chronicConditions;
    private String medications;
    private String emergencyNotes;
    private String primaryPhysician;
    private String insuranceProvider;
    private String insuranceNumber;
    private Boolean organDonor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MedicalProfile() {}

    public MedicalProfile(String id, String userId) {
        this.id = id;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getChronicConditions() { return chronicConditions; }
    public void setChronicConditions(String chronicConditions) { this.chronicConditions = chronicConditions; }
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    public String getEmergencyNotes() { return emergencyNotes; }
    public void setEmergencyNotes(String emergencyNotes) { this.emergencyNotes = emergencyNotes; }
    public String getPrimaryPhysician() { return primaryPhysician; }
    public void setPrimaryPhysician(String primaryPhysician) { this.primaryPhysician = primaryPhysician; }
    public String getInsuranceProvider() { return insuranceProvider; }
    public void setInsuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; }
    public String getInsuranceNumber() { return insuranceNumber; }
    public void setInsuranceNumber(String insuranceNumber) { this.insuranceNumber = insuranceNumber; }
    public Boolean getOrganDonor() { return organDonor; }
    public void setOrganDonor(Boolean organDonor) { this.organDonor = organDonor; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
