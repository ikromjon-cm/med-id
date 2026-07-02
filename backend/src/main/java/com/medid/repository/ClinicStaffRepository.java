package com.medid.repository;

import com.medid.model.ClinicStaff;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class ClinicStaffRepository {

    private final ConcurrentHashMap<String, ClinicStaff> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public ClinicStaff save(ClinicStaff staff) {
        if (staff.getId() == null) {
            staff.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(staff.getId(), staff);
        return staff;
    }

    public Optional<ClinicStaff> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<ClinicStaff> findByClinicId(String clinicId) {
        return store.values().stream()
            .filter(s -> s.getClinicId().equals(clinicId))
            .toList();
    }

    public List<ClinicStaff> findByClinicIdAndRole(String clinicId, ClinicStaff.Role role) {
        return store.values().stream()
            .filter(s -> s.getClinicId().equals(clinicId) && s.getRole() == role)
            .toList();
    }

    public List<ClinicStaff> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }
}
