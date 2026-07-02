package com.medid.repository;

import com.medid.model.User;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class UserRepository {

    private final ConcurrentHashMap<String, User> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(user.getId(), user);
        return user;
    }

    public Optional<User> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public Optional<User> findByPhone(String phone) {
        return store.values().stream()
            .filter(u -> u.getPhone().equals(phone))
            .findFirst();
    }

    public List<User> findAll() {
        return new ArrayList<>(store.values());
    }

    public List<User> findByRole(com.medid.model.Role role) {
        return store.values().stream()
            .filter(u -> u.getRole() == role)
            .toList();
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }

    public long countByRole(com.medid.model.Role role) {
        return store.values().stream().filter(u -> u.getRole() == role).count();
    }

    public void clear() {
        store.clear();
        counter.set(1);
    }

    public void setCounter(long value) {
        counter.set(value);
    }
}
