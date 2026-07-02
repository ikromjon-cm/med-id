package com.medid.service;

import com.medid.model.ClinicStaff;
import com.medid.repository.ClinicStaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClinicStaffService {

    private final ClinicStaffRepository repository;

    public ClinicStaffService(ClinicStaffRepository repository) {
        this.repository = repository;
    }

    public List<ClinicStaff> findByClinicId(String clinicId) {
        return repository.findByClinicId(clinicId);
    }

    public List<ClinicStaff> findDoctorsByClinic(String clinicId) {
        return repository.findByClinicIdAndRole(clinicId, ClinicStaff.Role.DOCTOR);
    }

    public ClinicStaff findById(String id) {
        return repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + id));
    }

    public ClinicStaff create(ClinicStaff staff) {
        return repository.save(staff);
    }

    public ClinicStaff update(String id, ClinicStaff updated) {
        var staff = findById(id);
        if (updated.getFullName() != null) staff.setFullName(updated.getFullName());
        if (updated.getRole() != null) staff.setRole(updated.getRole());
        if (updated.getPhone() != null) staff.setPhone(updated.getPhone());
        if (updated.getEmail() != null) staff.setEmail(updated.getEmail());
        if (updated.getSpecialization() != null) staff.setSpecialization(updated.getSpecialization());
        staff.setIsActive(updated.getIsActive());
        return repository.save(staff);
    }

    public void delete(String id) {
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Staff not found: " + id);
        }
        repository.deleteById(id);
    }
}
