package com.pethealthtracker.dto.reminders;

import java.time.LocalDate;
import java.time.LocalTime;

import com.pethealthtracker.model.enums.RecurrencePattern;
import com.pethealthtracker.model.enums.ReminderType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderRequestDTO {
    // Relaciones claves foraneas
    @NotNull(message = "El ID de usuario no puede ser nulo.")
    private Long userId;

    @NotNull(message = "El ID de la mascota no puede ser nulo.")
    private Long petId;

    // Campos principales
    @NotNull(message = "El tipo de recordatorio no puede ser nulo.")
    private ReminderType reminderType;

    @NotNull(message = "El titulo no puede ser nulo.")
    @Size(max = 200, message = "El titulo no puede exeder los 200 caracteres.")
    private String title;

    @Size(max = 500, message = "La descripcion no puede exceder los 500 caracteres.")
    private String description;

    @NotNull(message = "La fecha de vencimiento no puede ser nula.")
    private LocalDate dueDate;

    private LocalTime dueTime;

    // Recurrencia
    private Boolean isRecurring;

    private RecurrencePattern recurrencePattern;

    private String customRecurrence;
}
