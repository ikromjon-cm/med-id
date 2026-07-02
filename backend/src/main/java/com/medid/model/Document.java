package com.medid.model;

import java.time.LocalDateTime;

public class Document {

    private String id;
    private String userId;
    private String name;
    private DocumentType type;
    private String description;
    private Long fileSize;
    private LocalDateTime uploadDate;

    public Document() {}

    public Document(String id, String userId, String name, DocumentType type, String description, Long fileSize) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.type = type;
        this.description = description;
        this.fileSize = fileSize;
        this.uploadDate = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public DocumentType getType() { return type; }
    public void setType(DocumentType type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
}
