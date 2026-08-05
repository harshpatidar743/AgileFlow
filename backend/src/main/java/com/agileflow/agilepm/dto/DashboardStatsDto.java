package com.agileflow.agilepm.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {

    private long totalProjects;
    private long totalUserStories;
    private long totalTasks;
    private long todoTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long urgentTasks;
    private long unreadNotificationsCount;
}
