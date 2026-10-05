package com.pethealthtracker.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Importación corregida a Spring Transactional

import com.pethealthtracker.dto.reminders.ReminderRequestDTO;
import com.pethealthtracker.dto.reminders.ReminderResponseDTO;
import com.pethealthtracker.exception.ResourceNotFoundException;
import com.pethealthtracker.model.Pet;
import com.pethealthtracker.model.Reminder;
import com.pethealthtracker.model.User;
import com.pethealthtracker.repository.PetRepository;
import com.pethealthtracker.repository.ReminderRepository;
import com.pethealthtracker.repository.UserRepository;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;

    public ReminderService(ReminderRepository reminderRepository, UserRepository userRepository,
            PetRepository petRepository) {
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    @Transactional
    public ReminderResponseDTO createReminder(ReminderRequestDTO requestDTO) {
        // 1. Validar existencias
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", requestDTO.getUserId()));

        Pet pet = petRepository.findById(requestDTO.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "id", requestDTO.getPetId()));

        // Mapear DTO a Entidad
        Reminder reminder = mapToEntity(requestDTO, user, pet);

        // Guardar a la DB
        Reminder savedReminder = reminderRepository.save(reminder);

        return mapToResponseDTO(savedReminder);
    }

    @Transactional
    public ReminderResponseDTO markAsCompleted(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", reminderId));

        // Logica de negocio: Marcar como completado y registrar el tiempo
        reminder.setIsCompleted(true);
        reminder.setCompletedAt(LocalDateTime.now()); // **CORRECCIÓN 1: Cambia LocalDate.now() a LocalDateTime.now()**

        // Guardar y devolver el estado actualizado
        return mapToResponseDTO(reminderRepository.save(reminder));
    }

    @Transactional(readOnly = true)
    public List<ReminderResponseDTO> getPendingReminders(Long userId) {
        List<Reminder> pendingReminders = reminderRepository.findByUserIdAndIsCompletedFalse(userId);

        return pendingReminders.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReminderResponseDTO> getAllRemindersByUserId(Long userId) {
        List<Reminder> reminders = reminderRepository.findByUserId(userId);
        return reminders.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Transactional
    public ReminderResponseDTO toggleCompleted(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", reminderId));

        boolean newState = reminder.getIsCompleted() == null || !reminder.getIsCompleted();
        reminder.setIsCompleted(newState);
        reminder.setCompletedAt(newState ? LocalDateTime.now() : null);

        return mapToResponseDTO(reminderRepository.save(reminder));
    }

    @Transactional
    public ReminderResponseDTO updateReminder(Long reminderId, ReminderRequestDTO requestDTO) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", reminderId));

        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", requestDTO.getUserId()));

        Pet pet = petRepository.findById(requestDTO.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "id", requestDTO.getPetId()));

        reminder.setUser(user);
        reminder.setPet(pet);
        reminder.setReminderType(requestDTO.getReminderType());
        reminder.setTitle(requestDTO.getTitle());
        reminder.setDescription(requestDTO.getDescription());
        reminder.setDueDate(requestDTO.getDueDate());
        reminder.setDueTime(requestDTO.getDueTime());
        reminder.setIsRecurring(requestDTO.getIsRecurring() != null ? requestDTO.getIsRecurring() : false);
        reminder.setRecurrencePattern(requestDTO.getRecurrencePattern());
        reminder.setCustomRecurrence(requestDTO.getCustomRecurrence());
        reminder.setUpdatedAt(LocalDateTime.now());

        return mapToResponseDTO(reminderRepository.save(reminder));
    }

    @Transactional
    public void deleteReminder(Long reminderId) {
        if (!reminderRepository.existsById(reminderId)) {
            throw new ResourceNotFoundException("Reminder", "id", reminderId);
        }
        reminderRepository.deleteById(reminderId);
    }

    private Reminder mapToEntity(ReminderRequestDTO dto, User user, Pet pet) {
        return Reminder.builder()
                .user(user)
                .pet(pet)
                .title(dto.getTitle())
                .reminderType(dto.getReminderType())
                .description(dto.getDescription())
                .dueDate(dto.getDueDate())
                .dueTime(dto.getDueTime())
                .isRecurring(dto.getIsRecurring() != null ? dto.getIsRecurring() : false)
                .recurrencePattern(dto.getRecurrencePattern())
                .customRecurrence(dto.getCustomRecurrence())
                .isCompleted(false)
                .notificationSent(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private ReminderResponseDTO mapToResponseDTO(Reminder reminder) {
        return ReminderResponseDTO.builder()
                .id(reminder.getId())
                .userId(reminder.getUser().getId())
                .petId(reminder.getPet() != null ? reminder.getPet().getId() : null)
                .petName(reminder.getPet() != null ? reminder.getPet().getName() : null)
                .reminderType(reminder.getReminderType())
                .title(reminder.getTitle())
                .description(reminder.getDescription())
                .dueDate(reminder.getDueDate())
                .dueTime(reminder.getDueTime())
                .isRecurring(reminder.getIsRecurring())
                .recurrencePattern(reminder.getRecurrencePattern())
                .customRecurrence(reminder.getCustomRecurrence())
                .isCompleted(reminder.getIsCompleted())
                .completedAt(reminder.getCompletedAt())
                .notificationSent(reminder.getNotificationSent())
                .createdAt(reminder.getCreatedAt())
                .build();
    }
}