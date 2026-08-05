package com.agileflow.agilepm.service;

import com.agileflow.agilepm.dto.TaskDto;
import com.agileflow.agilepm.enums.Status;
import java.util.List;

public interface TaskService {
    List<TaskDto> getAllTasks(String userStoryId, String projectId);
    TaskDto getTaskById(String id);
    TaskDto createTask(TaskDto taskDto);
    TaskDto updateTask(String id, TaskDto taskDto);
    TaskDto updateTaskStatus(String id, Status status);
    void deleteTask(String id);
}
