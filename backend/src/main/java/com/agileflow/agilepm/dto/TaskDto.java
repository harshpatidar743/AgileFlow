package com.agileflow.agilepm.dto;

import com.agileflow.agilepm.enums.Priority;
import com.agileflow.agilepm.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {

    private String id;

    @NotNull(message = "User story ID is required")
    private String userStoryId;
    private String userStoryTitle;
    private String projectId;
    private String projectName;

    @NotBlank(message = "Task title is required")
    @Size(min = 2, max = 150, message = "Task title must be between 2 and 150 characters")
    private String title;

    private String description;

    private Status status;
    private Priority priority;

    private LocalDateTime dueDate;
    private boolean notified;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
