package com.medid.model;

public class ClinicStaff {

    public enum Role {
        DOCTOR, NURSE, RECEPTIONIST, ADMIN
    }

    private String id;
    private String clinicId;
    private String fullName;
    private Role role;
    private String phone;
    private String email;
    private String specialization;
    private boolean isActive;

    public ClinicStaff() {}

    public ClinicStaff(String id, String clinicId, String fullName, Role role, String phone, String email, String specialization, boolean isActive) {
        this.id = id;
        this.clinicId = clinicId;
        this.fullName = fullName;
        this.role = role;
        this.phone = phone;
        this.email = email;
        this.specialization = specialization;
        this.isActive = isActive;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClinicId() { return clinicId; }
    public void setClinicId(String clinicId) { this.clinicId = clinicId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public boolean getIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }
}
