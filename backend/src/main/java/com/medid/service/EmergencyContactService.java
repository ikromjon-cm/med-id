package com.medid.service;

import com.medid.dto.EmergencyContactDto;
import com.medid.model.EmergencyContact;
import com.medid.repository.EmergencyContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyContactService {

    private final EmergencyContactRepository repository;

    public EmergencyContactService(EmergencyContactRepository repository) {
        this.repository = repository;
    }

    public List<EmergencyContactDto> findByUserId(String userId) {
        return repository.findByUserId(userId).stream().map(EmergencyContactDto::from).toList();
    }

    public EmergencyContactDto create(String userId, EmergencyContactDto dto) {
        var contact = new EmergencyContact();
        contact.setUserId(userId);
        contact.setName(dto.name());
        contact.setPhone(dto.phone());
        contact.setRelationship(dto.relationship());
        contact.setIsPrimary(dto.isPrimary() != null ? dto.isPrimary() : false);
        return EmergencyContactDto.from(repository.save(contact));
    }

    public EmergencyContactDto update(String id, EmergencyContactDto dto) {
        var contact = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Emergency contact not found: " + id));
        if (dto.name() != null) contact.setName(dto.name());
        if (dto.phone() != null) contact.setPhone(dto.phone());
        if (dto.relationship() != null) contact.setRelationship(dto.relationship());
        if (dto.isPrimary() != null) contact.setIsPrimary(dto.isPrimary());
        return EmergencyContactDto.from(repository.save(contact));
    }

    public void delete(String id) {
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Emergency contact not found: " + id);
        }
        repository.deleteById(id);
    }
}
