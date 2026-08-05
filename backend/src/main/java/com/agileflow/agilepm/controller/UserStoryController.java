package com.agileflow.agilepm.controller;

import com.agileflow.agilepm.dto.UserStoryDto;
import com.agileflow.agilepm.service.UserStoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-stories")
@RequiredArgsConstructor
@Tag(name = "User Stories", description = "Endpoints for User Story management within Projects")
public class UserStoryController {

    private final UserStoryService userStoryService;

    @GetMapping
    @Operation(summary = "Get user stories", description = "Retrieves user stories, optionally filtered by projectId query parameter")
    public ResponseEntity<List<UserStoryDto>> getAllUserStories(@RequestParam(required = false) String projectId) {
        return ResponseEntity.ok(userStoryService.getAllUserStories(projectId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user story by ID", description = "Retrieves a specific user story by its unique identifier")
    public ResponseEntity<UserStoryDto> getUserStoryById(@PathVariable String id) {
        return ResponseEntity.ok(userStoryService.getUserStoryById(id));
    }

    @PostMapping
    @Operation(summary = "Create user story", description = "Creates a user story linked to a parent project")
    public ResponseEntity<UserStoryDto> createUserStory(@Valid @RequestBody UserStoryDto userStoryDto) {
        return new ResponseEntity<>(userStoryService.createUserStory(userStoryDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user story", description = "Updates title, description, status, or priority of a user story")
    public ResponseEntity<UserStoryDto> updateUserStory(@PathVariable String id, @Valid @RequestBody UserStoryDto userStoryDto) {
        return ResponseEntity.ok(userStoryService.updateUserStory(id, userStoryDto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user story", description = "Deletes a user story and all its child tasks")
    public ResponseEntity<Void> deleteUserStory(@PathVariable String id) {
        userStoryService.deleteUserStory(id);
        return ResponseEntity.noContent().build();
    }
}
