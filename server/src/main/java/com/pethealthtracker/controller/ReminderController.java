package com.pethealthtracker.controller;

import com.pethealthtracker.dto.ApiResponse;
import com.pethealthtracker.dto.reminders.ReminderRequestDTO;
import com.pethealthtracker.dto.reminders.ReminderResponseDTO;
import com.pethealthtracker.service.ReminderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Recordatorios", description = "Operaciones CRUD para la agenda y recordatorios de mascotas")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @Operation(summary = "Crear nuevo recordatorio en base de datos")
    @PostMapping
    public ResponseEntity<ApiResponse<ReminderResponseDTO>> createReminder(
            @Valid @RequestBody ReminderRequestDTO requestDTO) {
        ReminderResponseDTO created = reminderService.createReminder(requestDTO);
        return new ResponseEntity<>(ApiResponse.<ReminderResponseDTO>builder()
                .success(true)
                .message("Recordatorio creado exitosamente")
                .data(created)
                .build(), HttpStatus.CREATED);
    }

    @Operation(summary = "Obtener todos los recordatorios de un usuario")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReminderResponseDTO>>> getAllRemindersByUserId(
            @PathVariable Long userId) {
        List<ReminderResponseDTO> reminders = reminderService.getAllRemindersByUserId(userId);
        return ResponseEntity.ok(ApiResponse.<List<ReminderResponseDTO>>builder()
                .success(true)
                .data(reminders)
                .build());
    }

    @Operation(summary = "Actualizar un recordatorio existente")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReminderResponseDTO>> updateReminder(
            @PathVariable Long id,
            @Valid @RequestBody ReminderRequestDTO requestDTO) {
        ReminderResponseDTO updated = reminderService.updateReminder(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.<ReminderResponseDTO>builder()
                .success(true)
                .message("Recordatorio actualizado exitosamente")
                .data(updated)
                .build());
    }

    @Operation(summary = "Alternar estado completado del recordatorio")
    @PatchMapping("/{id}/toggle-complete")
    public ResponseEntity<ApiResponse<ReminderResponseDTO>> toggleCompleted(
            @PathVariable Long id) {
        ReminderResponseDTO updated = reminderService.toggleCompleted(id);
        return ResponseEntity.ok(ApiResponse.<ReminderResponseDTO>builder()
                .success(true)
                .message("Estado del recordatorio actualizado")
                .data(updated)
                .build());
    }

    @Operation(summary = "Eliminar recordatorio de la base de datos")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(
            @PathVariable Long id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Recordatorio eliminado exitosamente")
                .build());
    }
}
