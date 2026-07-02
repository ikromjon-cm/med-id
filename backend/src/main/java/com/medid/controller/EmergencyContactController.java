package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.dto.EmergencyContactDto;
import com.medid.service.EmergencyContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EmergencyContactController {

    private final EmergencyContactService service;

    public EmergencyContactController(EmergencyContactService service) {
        this.service = service;
    }

    @GetMapping("/patients/{patientId}/emergency-contacts")
    public ResponseEntity<ApiResponse<List<EmergencyContactDto>>> getByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(ApiResponse.ok(service.findByUserId(patientId)));
    }

    @PostMapping("/patients/{patientId}/emergency-contacts")
    public ResponseEntity<ApiResponse<EmergencyContactDto>> create(@PathVariable String patientId,
                                                                    @RequestBody EmergencyContactDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.create(patientId, dto)));
    }

    @PutMapping("/emergency-contacts/{id}")
    public ResponseEntity<ApiResponse<EmergencyContactDto>> update(@PathVariable String id,
                                                                    @RequestBody EmergencyContactDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto)));
    }

    @DeleteMapping("/emergency-contacts/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Emergency contact deleted successfully"));
    }
}
