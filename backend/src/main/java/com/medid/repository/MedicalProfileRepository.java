package com.medid.repository;

import com.medid.model.MedicalProfile;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class MedicalProfileRepository {

    private final ConcurrentHashMap<String, MedicalProfile> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public MedicalProfile save(MedicalProfile profile) {
        if (profile.getId() == null) {
            profile.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(profile.getId(), profile);
        return profile;
    }

    public Optional<MedicalProfile> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public Optional<MedicalProfile> findByUserId(String userId) {
        return store.values().stream()
            .filter(p -> p.getUserId().equals(userId))
            .findFirst();
    }

    public List<MedicalProfile> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }
}
