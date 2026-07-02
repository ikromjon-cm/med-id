package com.medid.dto;

import com.medid.model.Document;
import com.medid.model.DocumentType;
import java.time.LocalDateTime;

public record DocumentDto(
    String id,
    String userId,
    String name,
    DocumentType type,
    String description,
    Long fileSize,
    LocalDateTime uploadDate
) {
    public static DocumentDto from(Document doc) {
        return new DocumentDto(
            doc.getId(), doc.getUserId(), doc.getName(),
            doc.getType(), doc.getDescription(), doc.getFileSize(),
            doc.getUploadDate()
        );
    }
}
