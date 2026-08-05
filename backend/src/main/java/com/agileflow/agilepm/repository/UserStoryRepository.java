package com.agileflow.agilepm.repository;

import com.agileflow.agilepm.entity.UserStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, String> {
    List<UserStory> findByProjectId(String projectId);
}
