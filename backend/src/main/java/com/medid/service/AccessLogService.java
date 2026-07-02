package com.medid.service;

import com.medid.dto.AccessLogDto;
import com.medid.model.AccessLog;
import com.medid.repository.AccessLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccessLogService {

    private final AccessLogRepository repository;

    public AccessLogService(AccessLogRepository repository) {
        this.repository = repository;
    }

    public List<AccessLogDto> findByUserId(String userId) {
        return repository.findByUserId(userId).stream().map(AccessLogDto::from).toList();
    }

    public List<AccessLogDto> findAll() {
        return repository.findAll().stream().map(AccessLogDto::from).toList();
    }

    public AccessLogDto create(AccessLogDto dto) {
        var log = new AccessLog();
        log.setUserId(dto.userId());
        log.setAccessedByUserId(dto.accessedByUserId());
        log.setAction(dto.action());
        log.setIpAddress(dto.ipAddress());
        return AccessLogDto.from(repository.save(log));
    }
}
