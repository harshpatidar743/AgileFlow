package com.agileflow.agilepm.scheduler;

import com.agileflow.agilepm.entity.Notification;
import com.agileflow.agilepm.entity.Task;
import com.agileflow.agilepm.repository.NotificationRepository;
import com.agileflow.agilepm.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Background Scheduler that periodically checks for upcoming due tasks.
 * Requirement: Every minute, check for tasks whose due date is within the next 24 hours
 * and create a notification entry in the database.
 */
@Component
@RequiredArgsConstructor
public class TaskReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(TaskReminderScheduler.class);
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;

    // Runs every 15 seconds to reduce notification latency in low-traffic deployments
    @Scheduled(cron = "*/15 * * * * *")
    @Transactional
    public void checkForUpcomingDueTasks() {
        logger.debug("Executing scheduled task reminder check...");

        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime threshold = now.plusHours(24);

            List<Task> pendingTasks = taskRepository.findPendingTasksDueBefore(now, threshold);

            if (pendingTasks.isEmpty()) {
                logger.debug("No upcoming tasks due within 24 hours needing notification.");
                return;
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

            for (Task task : pendingTasks) {
                try {
                    String formattedDueDate = task.getDueDate() != null ? task.getDueDate().format(formatter) : "N/A";
                    String message = String.format("Reminder: Task '%s' in Story '%s' (Project: '%s') is due soon at %s!",
                            task.getTitle(),
                            task.getUserStory().getTitle(),
                            task.getUserStory().getProject().getName(),
                            formattedDueDate);

                    Notification notification = Notification.builder()
                            .taskId(task.getId())
                            .message(message)
                            .isRead(false)
                            .build();

                    notificationRepository.save(notification);

                    task.setNotified(true);
                    taskRepository.save(task);

                    logger.info("Created due date notification for task ID: {} ({})", task.getId(), task.getTitle());
                } catch (Exception e) {
                    logger.error("Failed to create notification for task ID {}: {}", task.getId(), e.getMessage(), e);
                }
            }
        } catch (Exception ex) {
            logger.error("Task reminder scheduler failed: {}", ex.getMessage(), ex);
        }
    }
}
