package com.agileflow.agilepm.service.impl;

import com.agileflow.agilepm.dto.UserStoryDto;
import com.agileflow.agilepm.entity.Project;
import com.agileflow.agilepm.entity.UserStory;
import com.agileflow.agilepm.enums.Status;
import com.agileflow.agilepm.exception.ResourceNotFoundException;
import com.agileflow.agilepm.repository.ProjectRepository;
import com.agileflow.agilepm.repository.UserStoryRepository;
import com.agileflow.agilepm.service.UserStoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserStoryServiceImpl implements UserStoryService {

    private final UserStoryRepository userStoryRepository;
    private final ProjectRepository projectRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserStoryDto> getAllUserStories(String projectId) {
        List<UserStory> stories;
        if (projectId != null && !projectId.trim().isEmpty()) {
            stories = userStoryRepository.findByProjectId(projectId);
        } else {
            stories = userStoryRepository.findAll();
        }
        return stories.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserStoryDto getUserStoryById(String id) {
        UserStory userStory = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + id));
        return mapToDto(userStory);
    }

    @Override
    public UserStoryDto createUserStory(UserStoryDto userStoryDto) {
        Project project = projectRepository.findById(userStoryDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + userStoryDto.getProjectId()));

        UserStory story = UserStory.builder()
                .project(project)
                .title(userStoryDto.getTitle())
                .description(userStoryDto.getDescription())
                .status(userStoryDto.getStatus() != null ? userStoryDto.getStatus() : Status.TODO)
                .priority(userStoryDto.getPriority())
                .build();

        UserStory saved = userStoryRepository.save(story);
        return mapToDto(saved);
    }

    @Override
    public UserStoryDto updateUserStory(String id, UserStoryDto userStoryDto) {
        UserStory story = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + id));

        if (userStoryDto.getProjectId() != null && !userStoryDto.getProjectId().equals(story.getProject().getId())) {
            Project project = projectRepository.findById(userStoryDto.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + userStoryDto.getProjectId()));
            story.setProject(project);
        }

        story.setTitle(userStoryDto.getTitle());
        story.setDescription(userStoryDto.getDescription());
        if (userStoryDto.getStatus() != null) story.setStatus(userStoryDto.getStatus());
        if (userStoryDto.getPriority() != null) story.setPriority(userStoryDto.getPriority());

        UserStory updated = userStoryRepository.save(story);
        return mapToDto(updated);
    }

    @Override
    public void deleteUserStory(String id) {
        if (!userStoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("User story not found with id: " + id);
        }
        userStoryRepository.deleteById(id);
    }

    private UserStoryDto mapToDto(UserStory story) {
        int totalTasks = story.getTasks() != null ? story.getTasks().size() : 0;
        int completedTasks = story.getTasks() != null ? (int) story.getTasks().stream()
                .filter(t -> t.getStatus() == Status.COMPLETED)
                .count() : 0;

        return UserStoryDto.builder()
                .id(story.getId())
                .projectId(story.getProject().getId())
                .projectName(story.getProject().getName())
                .title(story.getTitle())
                .description(story.getDescription())
                .status(story.getStatus())
                .priority(story.getPriority())
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .createdAt(story.getCreatedAt())
                .updatedAt(story.getUpdatedAt())
                .build();
    }
}
