package com.pethealthtracker.dto.reminders;

import com.pethealthtracker.model.enums.RecurrencePattern;
import com.pethealthtracker.model.enums.ReminderType;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderResponseDTO {

    // --- Identificación ---
    private Long id;
    private Long userId;
    private Long petId;
    private String petName;

    // --- Campos Principales ---
    private ReminderType reminderType;
    private String title;
    private String description;
    private LocalDate dueDate;
    private LocalTime dueTime;

    // --- Estado y Recurrencia ---
    private Boolean isRecurring;
    private RecurrencePattern recurrencePattern;
    private String customRecurrence;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private Boolean notificationSent;

    // --- Auditoría ---    
    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}