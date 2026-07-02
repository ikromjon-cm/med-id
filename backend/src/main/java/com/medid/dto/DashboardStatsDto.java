package com.medid.dto;

public record DashboardStatsDto(
    long totalUsers,
    long totalPatients,
    long totalDoctors,
    long totalClinics,
    long totalDocuments,
    long totalEmergencyContacts,
    long totalNotifications,
    long totalAccessLogs
) {}
