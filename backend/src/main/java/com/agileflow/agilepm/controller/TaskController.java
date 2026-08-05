package com.agileflow.agilepm.controller;

import com.agileflow.agilepm.dto.TaskDto;
import com.agileflow.agilepm.enums.Status;
import com.agileflow.agilepm.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Endpoints for atomic Task management within User Stories")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get tasks", description = "Retrieves tasks, optionally filtered by userStoryId or projectId")
    public ResponseEntity<List<TaskDto>> getAllTasks(
            @RequestParam(required = false) String userStoryId,
            @RequestParam(required = false) String projectId) {
        return ResponseEntity.ok(taskService.getAllTasks(userStoryId, projectId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Retrieves a specific task by its identifier")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    @Operation(summary = "Create task", description = "Creates a new task linked to a user story with optional due date")
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskDto taskDto) {
        return new ResponseEntity<>(taskService.createTask(taskDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task", description = "Updates details, status, priority, or due date of a task")
    public ResponseEntity<TaskDto> updateTask(@PathVariable String id, @Valid @RequestBody TaskDto taskDto) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDto));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status", description = "Quick status change endpoint for Kanban workflow transitions")
    public ResponseEntity<TaskDto> updateTaskStatus(@PathVariable String id, @RequestParam Status status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task", description = "Deletes a task by ID")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
