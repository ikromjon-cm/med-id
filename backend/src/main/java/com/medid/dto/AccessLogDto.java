package com.medid.dto;

import com.medid.model.AccessLog;
import java.time.LocalDateTime;

public record AccessLogDto(
    String id,
    String userId,
    String accessedByUserId,
    String action,
    LocalDateTime timestamp,
    String ipAddress
) {
    public static AccessLogDto from(AccessLog log) {
        return new AccessLogDto(
            log.getId(), log.getUserId(), log.getAccessedByUserId(),
            log.getAction(), log.getTimestamp(), log.getIpAddress()
        );
    }
}
