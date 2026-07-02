package com.medid.controller;

import com.medid.dto.ApiResponse;
import com.medid.dto.DashboardStatsDto;
import com.medid.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboardStats()));
    }

    @GetMapping("/analytics/users-growth")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getUsersGrowth() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUsersGrowth()));
    }

    @GetMapping("/analytics/emergency-access")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getEmergencyAccess() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getEmergencyAccess()));
    }

    @GetMapping("/analytics/documents")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDocuments() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDocuments()));
    }

    @GetMapping("/analytics/roles")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRoles() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getRoles()));
    }

    @GetMapping("/business-logic/insurance-expiry")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getInsuranceExpiry() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getInsuranceExpiry()));
    }

    @GetMapping("/business-logic/access-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAccessStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAccessStats()));
    }
}
