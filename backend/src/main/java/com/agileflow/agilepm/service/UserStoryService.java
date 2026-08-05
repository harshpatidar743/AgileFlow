package com.agileflow.agilepm.service;

import com.agileflow.agilepm.dto.UserStoryDto;
import java.util.List;

public interface UserStoryService {
    List<UserStoryDto> getAllUserStories(String projectId);
    UserStoryDto getUserStoryById(String id);
    UserStoryDto createUserStory(UserStoryDto userStoryDto);
    UserStoryDto updateUserStory(String id, UserStoryDto userStoryDto);
    void deleteUserStory(String id);
}
