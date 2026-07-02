package com.medid.service;

import com.medid.dto.MedicalProfileDto;
import com.medid.model.MedicalProfile;
import com.medid.repository.MedicalProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MedicalProfileService {

    private final MedicalProfileRepository repository;

    public MedicalProfileService(MedicalProfileRepository repository) {
        this.repository = repository;
    }

    public MedicalProfileDto findByUserId(String userId) {
        return repository.findByUserId(userId)
            .map(MedicalProfileDto::from)
            .orElseThrow(() -> new IllegalArgumentException("Profile not found for user: " + userId));
    }

    public MedicalProfileDto update(String userId, MedicalProfileDto dto) {
        var profile = repository.findByUserId(userId)
            .orElseGet(() -> {
                var p = new MedicalProfile();
                p.setUserId(userId);
                p.setCreatedAt(LocalDateTime.now());
                return p;
            });
        if (dto.bloodType() != null) profile.setBloodType(dto.bloodType());
        if (dto.allergies() != null) profile.setAllergies(dto.allergies());
        if (dto.chronicConditions() != null) profile.setChronicConditions(dto.chronicConditions());
        if (dto.medications() != null) profile.setMedications(dto.medications());
        if (dto.emergencyNotes() != null) profile.setEmergencyNotes(dto.emergencyNotes());
        if (dto.primaryPhysician() != null) profile.setPrimaryPhysician(dto.primaryPhysician());
        if (dto.insuranceProvider() != null) profile.setInsuranceProvider(dto.insuranceProvider());
        if (dto.insuranceNumber() != null) profile.setInsuranceNumber(dto.insuranceNumber());
        if (dto.organDonor() != null) profile.setOrganDonor(dto.organDonor());
        profile.setUpdatedAt(LocalDateTime.now());
        return MedicalProfileDto.from(repository.save(profile));
    }
}
