package com.medid.model;

public class EmergencyContact {

    private String id;
    private String userId;
    private String name;
    private String phone;
    private String relationship;
    private Boolean isPrimary;

    public EmergencyContact() {}

    public EmergencyContact(String id, String userId, String name, String phone, String relationship, Boolean isPrimary) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.phone = phone;
        this.relationship = relationship;
        this.isPrimary = isPrimary;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }
}
