package com.agileflow.agilepm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDto {

    private String id;

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 100, message = "Project name must be between 2 and 100 characters")
    private String name;

    private String description;

    private int totalUserStories;
    private int totalTasks;
    private int completedTasks;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
