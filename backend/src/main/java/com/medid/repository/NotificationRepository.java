package com.medid.repository;

import com.medid.model.Notification;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class NotificationRepository {

    private final ConcurrentHashMap<String, Notification> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public Notification save(Notification notification) {
        if (notification.getId() == null) {
            notification.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(notification.getId(), notification);
        return notification;
    }

    public Optional<Notification> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Notification> findByUserId(String userId) {
        return store.values().stream()
            .filter(n -> n.getUserId().equals(userId))
            .toList();
    }

    public List<Notification> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }
}
