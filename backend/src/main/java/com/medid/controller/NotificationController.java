package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.dto.NotificationDto;
import com.medid.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getByUser(@RequestParam(required = false) String userId) {
        if (userId != null) {
            return ResponseEntity.ok(ApiResponse.ok(service.findByUserId(userId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(service.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationDto>> create(@RequestBody NotificationDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.create(dto), "Notification sent"));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(service.markAsRead(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Notification deleted"));
    }
}
