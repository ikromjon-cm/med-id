package com.medid.controller;

import com.medid.dto.AccessLogDto;
import com.medid.dto.ApiResponse;
import com.medid.service.AccessLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/access-logs")
public class AccessLogController {

    private final AccessLogService service;

    public AccessLogController(AccessLogService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccessLogDto>>> getAll(@RequestParam(required = false) String userId) {
        if (userId != null) {
            return ResponseEntity.ok(ApiResponse.ok(service.findByUserId(userId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(service.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccessLogDto>> create(@RequestBody AccessLogDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.create(dto), "Access log created"));
    }
}
