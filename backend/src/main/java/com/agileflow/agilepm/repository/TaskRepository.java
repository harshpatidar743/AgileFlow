package com.agileflow.agilepm.repository;

import com.agileflow.agilepm.entity.Task;
import com.agileflow.agilepm.enums.Priority;
import com.agileflow.agilepm.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {

    List<Task> findByUserStoryId(String userStoryId);

    @Query("SELECT t FROM Task t WHERE t.userStory.project.id = :projectId")
    List<Task> findByProjectId(@Param("projectId") String projectId);

    List<Task> findByStatus(Status status);

    long countByStatus(Status status);

    long countByPriority(Priority priority);

    @Query("SELECT t FROM Task t WHERE t.dueDate IS NOT NULL AND t.dueDate >= :now AND t.dueDate <= :threshold AND t.status != 'COMPLETED' AND t.notified = false")
    List<Task> findPendingTasksDueBefore(@Param("now") LocalDateTime now, @Param("threshold") LocalDateTime threshold);
}
