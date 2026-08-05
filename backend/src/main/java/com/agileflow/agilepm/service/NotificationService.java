package com.agileflow.agilepm.service;

import com.agileflow.agilepm.dto.NotificationDto;
import java.util.List;

public interface NotificationService {
    List<NotificationDto> getAllNotifications();
    NotificationDto markAsRead(String id);
    void markAllAsRead();
    void deleteNotification(String id);
    long getUnreadCount();
}
