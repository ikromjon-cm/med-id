package com.medid.service;

import com.medid.dto.NotificationDto;
import com.medid.model.Notification;
import com.medid.model.NotificationType;
import com.medid.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public List<NotificationDto> findByUserId(String userId) {
        return repository.findByUserId(userId).stream().map(NotificationDto::from).toList();
    }

    public List<NotificationDto> findAll() {
        return repository.findAll().stream().map(NotificationDto::from).toList();
    }

    public NotificationDto create(NotificationDto dto) {
        var notification = new Notification();
        notification.setUserId(dto.userId());
        notification.setTitle(dto.title());
        notification.setMessage(dto.message());
        notification.setType(dto.type() != null ? dto.type() : NotificationType.INFO);
        return NotificationDto.from(repository.save(notification));
    }

    public NotificationDto markAsRead(String id) {
        var notification = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + id));
        notification.setRead(true);
        return NotificationDto.from(repository.save(notification));
    }

    public void delete(String id) {
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Notification not found: " + id);
        }
        repository.deleteById(id);
    }
}
