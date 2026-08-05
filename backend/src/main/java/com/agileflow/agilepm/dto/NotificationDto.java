package com.agileflow.agilepm.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {

    private String id;
    private String taskId;
    private String message;

    @JsonProperty("isRead")
    private boolean isRead;
    private LocalDateTime createdAt;
}
