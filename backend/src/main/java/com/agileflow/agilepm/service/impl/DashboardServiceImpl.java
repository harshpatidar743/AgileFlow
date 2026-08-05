package com.agileflow.agilepm.service.impl;

import com.agileflow.agilepm.dto.DashboardStatsDto;
import com.agileflow.agilepm.enums.Priority;
import com.agileflow.agilepm.enums.Status;
import com.agileflow.agilepm.repository.NotificationRepository;
import com.agileflow.agilepm.repository.ProjectRepository;
import com.agileflow.agilepm.repository.TaskRepository;
import com.agileflow.agilepm.repository.UserStoryRepository;
import com.agileflow.agilepm.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final UserStoryRepository userStoryRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public DashboardStatsDto getDashboardStats() {
        long totalProjects = projectRepository.count();
        long totalStories = userStoryRepository.count();
        long totalTasks = taskRepository.count();
        long todoTasks = taskRepository.countByStatus(Status.TODO);
        long inProgressTasks = taskRepository.countByStatus(Status.IN_PROGRESS);
        long completedTasks = taskRepository.countByStatus(Status.COMPLETED);
        long urgentTasks = taskRepository.countByPriority(Priority.URGENT);
        long unreadNotifications = notificationRepository.countByIsReadFalse();

        return DashboardStatsDto.builder()
                .totalProjects(totalProjects)
                .totalUserStories(totalStories)
                .totalTasks(totalTasks)
                .todoTasks(todoTasks)
                .inProgressTasks(inProgressTasks)
                .completedTasks(completedTasks)
                .urgentTasks(urgentTasks)
                .unreadNotificationsCount(unreadNotifications)
                .build();
    }
}
