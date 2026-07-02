package com.medid.dto;

import com.medid.model.Role;
import com.medid.model.User;
import java.time.LocalDateTime;

public record UserDto(
    String id,
    String phone,
    String name,
    String email,
    Role role,
    String bloodType,
    String allergies,
    String chronicConditions,
    String emergencyNotes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static UserDto from(User user) {
        return new UserDto(
            user.getId(), user.getPhone(), user.getName(), user.getEmail(),
            user.getRole(), user.getBloodType(), user.getAllergies(),
            user.getChronicConditions(), user.getEmergencyNotes(),
            user.getCreatedAt(), user.getUpdatedAt()
        );
    }
}
