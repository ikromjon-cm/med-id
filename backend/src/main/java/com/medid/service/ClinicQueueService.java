package com.medid.service;

import com.medid.model.ClinicQueue;
import com.medid.repository.ClinicQueueRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClinicQueueService {

    private final ClinicQueueRepository repository;

    public ClinicQueueService(ClinicQueueRepository repository) {
        this.repository = repository;
    }

    public List<ClinicQueue> getQueueByClinic(String clinicId) {
        return repository.findByClinicId(clinicId);
    }

    public List<ClinicQueue> getWaitingQueue(String clinicId) {
        return repository.findByClinicIdAndStatus(clinicId, ClinicQueue.Status.WAITING);
    }

    public ClinicQueue addToQueue(ClinicQueue entry) {
        entry.setJoinedAt(LocalDateTime.now());
        if (entry.getStatus() == null) {
            entry.setStatus(ClinicQueue.Status.WAITING);
        }
        if (entry.getPriority() == null) {
            entry.setPriority(ClinicQueue.Priority.LOW);
        }
        return repository.save(entry);
    }

    public ClinicQueue callNext(String clinicId) {
        var waiting = getWaitingQueue(clinicId);
        if (waiting.isEmpty()) {
            throw new IllegalArgumentException("No patients in queue");
        }
        var next = waiting.get(0);
        next.setStatus(ClinicQueue.Status.WITH_DOCTOR);
        return repository.save(next);
    }

    public ClinicQueue updateStatus(String id, ClinicQueue.Status status) {
        var entry = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Queue entry not found: " + id));
        entry.setStatus(status);
        return repository.save(entry);
    }

    public void removeFromQueue(String id) {
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Queue entry not found: " + id);
        }
        repository.deleteById(id);
    }
}
