package com.medid.dto;

import com.medid.model.Notification;
import com.medid.model.NotificationType;
import java.time.LocalDateTime;

public record NotificationDto(
    String id,
    String userId,
    String title,
    String message,
    NotificationType type,
    Boolean read,
    LocalDateTime createdAt
) {
    public static NotificationDto from(Notification notification) {
        return new NotificationDto(
            notification.getId(), notification.getUserId(), notification.getTitle(),
            notification.getMessage(), notification.getType(), notification.getRead(),
            notification.getCreatedAt()
        );
    }
}
