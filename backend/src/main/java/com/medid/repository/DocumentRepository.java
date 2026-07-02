package com.medid.repository;

import com.medid.model.Document;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class DocumentRepository {

    private final ConcurrentHashMap<String, Document> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public Document save(Document document) {
        if (document.getId() == null) {
            document.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(document.getId(), document);
        return document;
    }

    public Optional<Document> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Document> findByUserId(String userId) {
        return store.values().stream()
            .filter(d -> d.getUserId().equals(userId))
            .toList();
    }

    public List<Document> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }
}
