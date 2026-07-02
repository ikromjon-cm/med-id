package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.dto.MedicalProfileDto;
import com.medid.service.MedicalProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients/{id}/profile")
public class MedicalProfileController {

    private final MedicalProfileService medicalProfileService;

    public MedicalProfileController(MedicalProfileService medicalProfileService) {
        this.medicalProfileService = medicalProfileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<MedicalProfileDto>> get(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(medicalProfileService.findByUserId(id)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<MedicalProfileDto>> update(@PathVariable String id,
                                                                  @RequestBody MedicalProfileDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(medicalProfileService.update(id, dto)));
    }
}
