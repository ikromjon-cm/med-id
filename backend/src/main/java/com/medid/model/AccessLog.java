package com.medid.model;

import java.time.LocalDateTime;

public class AccessLog {

    private String id;
    private String userId;
    private String accessedByUserId;
    private String action;
    private LocalDateTime timestamp;
    private String ipAddress;

    public AccessLog() {}

    public AccessLog(String id, String userId, String accessedByUserId, String action, String ipAddress) {
        this.id = id;
        this.userId = userId;
        this.accessedByUserId = accessedByUserId;
        this.action = action;
        this.timestamp = LocalDateTime.now();
        this.ipAddress = ipAddress;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getAccessedByUserId() { return accessedByUserId; }
    public void setAccessedByUserId(String accessedByUserId) { this.accessedByUserId = accessedByUserId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
