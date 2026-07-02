package com.medid.repository;

import com.medid.model.EmergencyContact;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class EmergencyContactRepository {

    private final ConcurrentHashMap<String, EmergencyContact> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public EmergencyContact save(EmergencyContact contact) {
        if (contact.getId() == null) {
            contact.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(contact.getId(), contact);
        return contact;
    }

    public Optional<EmergencyContact> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<EmergencyContact> findByUserId(String userId) {
        return store.values().stream()
            .filter(c -> c.getUserId().equals(userId))
            .toList();
    }

    public List<EmergencyContact> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }
}
