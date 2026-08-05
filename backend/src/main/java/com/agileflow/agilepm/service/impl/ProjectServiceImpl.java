package com.agileflow.agilepm.service.impl;

import com.agileflow.agilepm.dto.ProjectDto;
import com.agileflow.agilepm.entity.Project;
import com.agileflow.agilepm.entity.Task;
import com.agileflow.agilepm.enums.Status;
import com.agileflow.agilepm.exception.ResourceNotFoundException;
import com.agileflow.agilepm.repository.ProjectRepository;
import com.agileflow.agilepm.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDto getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToDto(project);
    }

    @Override
    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = Project.builder()
                .name(projectDto.getName())
                .description(projectDto.getDescription())
                .build();
        Project saved = projectRepository.save(project);
        return mapToDto(saved);
    }

    @Override
    public ProjectDto updateProject(String id, ProjectDto projectDto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        Project updated = projectRepository.save(project);
        return mapToDto(updated);
    }

    @Override
    public void deleteProject(String id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    private ProjectDto mapToDto(Project project) {
        int totalStories = project.getUserStories() != null ? project.getUserStories().size() : 0;
        int totalTasks = 0;
        int completedTasks = 0;

        if (project.getUserStories() != null) {
            for (var story : project.getUserStories()) {
                if (story.getTasks() != null) {
                    totalTasks += story.getTasks().size();
                    completedTasks += (int) story.getTasks().stream()
                            .filter(t -> t.getStatus() == Status.COMPLETED)
                            .count();
                }
            }
        }

        return ProjectDto.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .totalUserStories(totalStories)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
