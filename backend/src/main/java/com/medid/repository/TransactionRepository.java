package com.medid.repository;

import com.medid.model.Transaction;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class TransactionRepository {

    private final ConcurrentHashMap<String, Transaction> store = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong(1);

    public Transaction save(Transaction transaction) {
        if (transaction.getId() == null) {
            transaction.setId(String.valueOf(counter.getAndIncrement()));
        }
        store.put(transaction.getId(), transaction);
        return transaction;
    }

    public Optional<Transaction> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Transaction> findByClinicId(String clinicId) {
        return store.values().stream()
            .filter(t -> t.getClinicId().equals(clinicId))
            .toList();
    }

    public List<Transaction> findByPatientId(String patientId) {
        return store.values().stream()
            .filter(t -> t.getPatientId().equals(patientId))
            .toList();
    }

    public List<Transaction> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public long count() {
        return store.size();
    }

    public double sumByClinicId(String clinicId) {
        return store.values().stream()
            .filter(t -> t.getClinicId().equals(clinicId) && t.getStatus() == Transaction.Status.COMPLETED)
            .mapToDouble(t -> t.getType() == Transaction.Type.PAYMENT ? t.getAmount() : -t.getAmount())
            .sum();
    }
}
