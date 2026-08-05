package com.agileflow.agilepm.service;

import com.agileflow.agilepm.dto.ProjectDto;
import java.util.List;

public interface ProjectService {
    List<ProjectDto> getAllProjects();
    ProjectDto getProjectById(String id);
    ProjectDto createProject(ProjectDto projectDto);
    ProjectDto updateProject(String id, ProjectDto projectDto);
    void deleteProject(String id);
}
