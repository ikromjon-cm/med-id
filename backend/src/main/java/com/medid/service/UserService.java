package com.medid.service;

import com.medid.dto.UserDto;
import com.medid.model.Role;
import com.medid.model.User;
import com.medid.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDto> findAll() {
        return userRepository.findAll().stream().map(UserDto::from).toList();
    }

    public UserDto findById(String id) {
        return userRepository.findById(id)
            .map(UserDto::from)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }

    public UserDto create(UserDto dto) {
        if (dto.phone() == null || dto.phone().isBlank()) {
            throw new IllegalArgumentException("Phone is required");
        }
        if (userRepository.findByPhone(dto.phone()).isPresent()) {
            throw new IllegalArgumentException("Phone already registered");
        }
        var user = new User();
        user.setId(UUID.randomUUID().toString().substring(0, 8));
        user.setPhone(dto.phone());
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setRole(dto.role() != null ? dto.role() : Role.PATIENT);
        user.setBloodType(dto.bloodType());
        user.setAllergies(dto.allergies());
        user.setChronicConditions(dto.chronicConditions());
        user.setEmergencyNotes(dto.emergencyNotes());
        user.setPasswordHash("hashed_" + dto.phone());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return UserDto.from(userRepository.save(user));
    }

    public UserDto update(String id, UserDto dto) {
        var user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        if (dto.name() != null) user.setName(dto.name());
        if (dto.email() != null) user.setEmail(dto.email());
        if (dto.phone() != null) user.setPhone(dto.phone());
        if (dto.role() != null) user.setRole(dto.role());
        if (dto.bloodType() != null) user.setBloodType(dto.bloodType());
        if (dto.allergies() != null) user.setAllergies(dto.allergies());
        if (dto.chronicConditions() != null) user.setChronicConditions(dto.chronicConditions());
        if (dto.emergencyNotes() != null) user.setEmergencyNotes(dto.emergencyNotes());
        user.setUpdatedAt(LocalDateTime.now());
        return UserDto.from(userRepository.save(user));
    }

    public void delete(String id) {
        if (userRepository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }
}
