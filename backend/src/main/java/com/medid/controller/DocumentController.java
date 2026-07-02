package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.dto.DocumentDto;
import com.medid.service.DocumentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/patients/{patientId}/documents")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(ApiResponse.ok(documentService.findByUserId(patientId)));
    }

    @PostMapping("/patients/{patientId}/documents")
    public ResponseEntity<ApiResponse<DocumentDto>> upload(@PathVariable String patientId,
                                                            @RequestBody DocumentDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(documentService.create(patientId, dto)));
    }

    @GetMapping("/documents/{id}")
    public ResponseEntity<ApiResponse<DocumentDto>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(documentService.findById(id)));
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        documentService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Document deleted successfully"));
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable String id) {
        var content = documentService.getDownloadContent(id);
        var doc = documentService.findById(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.name() + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(content);
    }
}
