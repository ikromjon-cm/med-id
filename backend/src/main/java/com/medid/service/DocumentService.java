package com.medid.service;

import com.medid.dto.DocumentDto;
import com.medid.model.Document;
import com.medid.model.DocumentType;
import com.medid.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository repository;

    public DocumentService(DocumentRepository repository) {
        this.repository = repository;
    }

    public List<DocumentDto> findByUserId(String userId) {
        return repository.findByUserId(userId).stream().map(DocumentDto::from).toList();
    }

    public DocumentDto findById(String id) {
        return repository.findById(id)
            .map(DocumentDto::from)
            .orElseThrow(() -> new IllegalArgumentException("Document not found: " + id));
    }

    public DocumentDto create(String userId, DocumentDto dto) {
        var doc = new Document();
        doc.setUserId(userId);
        doc.setName(dto.name() != null ? dto.name() : "Untitled");
        doc.setType(dto.type() != null ? dto.type() : DocumentType.OTHER);
        doc.setDescription(dto.description());
        doc.setFileSize(dto.fileSize() != null ? dto.fileSize() : 0L);
        return DocumentDto.from(repository.save(doc));
    }

    public void delete(String id) {
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Document not found: " + id);
        }
        repository.deleteById(id);
    }

    public byte[] getDownloadContent(String id) {
        var doc = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Document not found: " + id));
        return ("Mock content for document: " + doc.getName()).getBytes();
    }
}
