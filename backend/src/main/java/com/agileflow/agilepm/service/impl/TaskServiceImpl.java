package com.agileflow.agilepm.service.impl;

import com.agileflow.agilepm.dto.TaskDto;
import com.agileflow.agilepm.entity.Task;
import com.agileflow.agilepm.entity.UserStory;
import com.agileflow.agilepm.enums.Status;
import com.agileflow.agilepm.exception.ResourceNotFoundException;
import com.agileflow.agilepm.repository.TaskRepository;
import com.agileflow.agilepm.repository.UserStoryRepository;
import com.agileflow.agilepm.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserStoryRepository userStoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks(String userStoryId, String projectId) {
        List<Task> tasks;
        if (userStoryId != null && !userStoryId.trim().isEmpty()) {
            tasks = taskRepository.findByUserStoryId(userStoryId);
        } else if (projectId != null && !projectId.trim().isEmpty()) {
            tasks = taskRepository.findByProjectId(projectId);
        } else {
            tasks = taskRepository.findAll();
        }
        return tasks.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDto getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return mapToDto(task);
    }

    @Override
    public TaskDto createTask(TaskDto taskDto) {
        UserStory story = userStoryRepository.findById(taskDto.getUserStoryId())
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + taskDto.getUserStoryId()));

        Task task = Task.builder()
                .userStory(story)
                .title(taskDto.getTitle())
                .description(taskDto.getDescription())
                .status(taskDto.getStatus() != null ? taskDto.getStatus() : Status.TODO)
                .priority(taskDto.getPriority())
                .dueDate(taskDto.getDueDate())
                .notified(false)
                .build();

        Task saved = taskRepository.save(task);
        return mapToDto(saved);
    }

    @Override
    public TaskDto updateTask(String id, TaskDto taskDto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        if (taskDto.getUserStoryId() != null && !taskDto.getUserStoryId().equals(task.getUserStory().getId())) {
            UserStory story = userStoryRepository.findById(taskDto.getUserStoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + taskDto.getUserStoryId()));
            task.setUserStory(story);
        }

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        if (taskDto.getStatus() != null) task.setStatus(taskDto.getStatus());
        if (taskDto.getPriority() != null) task.setPriority(taskDto.getPriority());
        
        // If due date changed or was cleared, reset the reminder flag.
        if (!Objects.equals(taskDto.getDueDate(), task.getDueDate())) {
            task.setDueDate(taskDto.getDueDate());
            task.setNotified(false);
        }

        Task updated = taskRepository.save(task);
        return mapToDto(updated);
    }

    @Override
    public TaskDto updateTaskStatus(String id, Status status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setStatus(status);
        Task updated = taskRepository.save(task);
        return mapToDto(updated);
    }

    @Override
    public void deleteTask(String id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    private TaskDto mapToDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .userStoryId(task.getUserStory().getId())
                .userStoryTitle(task.getUserStory().getTitle())
                .projectId(task.getUserStory().getProject().getId())
                .projectName(task.getUserStory().getProject().getName())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .notified(task.isNotified())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
