package com.medid.dto;

import com.medid.model.MedicalProfile;
import java.time.LocalDateTime;

public record MedicalProfileDto(
    String id,
    String userId,
    String bloodType,
    String allergies,
    String chronicConditions,
    String medications,
    String emergencyNotes,
    String primaryPhysician,
    String insuranceProvider,
    String insuranceNumber,
    Boolean organDonor,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static MedicalProfileDto from(MedicalProfile profile) {
        return new MedicalProfileDto(
            profile.getId(), profile.getUserId(), profile.getBloodType(),
            profile.getAllergies(), profile.getChronicConditions(), profile.getMedications(),
            profile.getEmergencyNotes(), profile.getPrimaryPhysician(),
            profile.getInsuranceProvider(), profile.getInsuranceNumber(),
            profile.getOrganDonor(), profile.getCreatedAt(), profile.getUpdatedAt()
        );
    }

    public MedicalProfile toEntity() {
        var profile = new MedicalProfile();
        profile.setBloodType(bloodType);
        profile.setAllergies(allergies);
        profile.setChronicConditions(chronicConditions);
        profile.setMedications(medications);
        profile.setEmergencyNotes(emergencyNotes);
        profile.setPrimaryPhysician(primaryPhysician);
        profile.setInsuranceProvider(insuranceProvider);
        profile.setInsuranceNumber(insuranceNumber);
        profile.setOrganDonor(organDonor);
        return profile;
    }
}
