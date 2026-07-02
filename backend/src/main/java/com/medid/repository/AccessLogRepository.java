package com.medid.repository;

import com.medid.model.AccessLog;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class AccessLogRepository {

    private final ConcurrentHashMap<String, AccessLog> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public AccessLog save(AccessLog log) {
        if (log.getId() == null) {
            log.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(log.getId(), log);
        return log;
    }

    public Optional<AccessLog> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<AccessLog> findByUserId(String userId) {
        return store.values().stream()
            .filter(l -> l.getUserId().equals(userId))
            .toList();
    }

    public List<AccessLog> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }
}
