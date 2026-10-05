package com.pethealthtracker.controller;

import com.pethealthtracker.dto.ApiResponse;
import com.pethealthtracker.dto.user.UserDto;
import com.pethealthtracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Controlador para gestionar las operaciones de usuario.
 * Permite a los usuarios autenticados gestionar su perfil y a los
 * administradores gestionar todos los usuarios.
 */
@Tag(name = "Usuarios (users)", description = "API para la gestión de usuarios")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {

        private final UserService userService;

        @Operation(summary = "Obtiene el perfil del usuario actual")
        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
                UserDto user = userService.getCurrentUser();
                return ResponseEntity.ok(ApiResponse.<UserDto>builder()
                                .success(true)
                                .data(user)
                                .build());
        }

        @Operation(summary = "Actualiza el perfil del usuario actual")
        @PutMapping("/me")
        public ResponseEntity<ApiResponse<UserDto>> updateUserProfile(
                        @Valid @RequestBody UserDto userDto) {
                UserDto updatedUser = userService.updateUser(userDto);
                return ResponseEntity.ok(ApiResponse.<UserDto>builder()
                                .success(true)
                                .message("Perfil actualizado correctamente")
                                .data(updatedUser)
                                .build());
        }

        @Operation(summary = "Elimina el usuario actual")
        @DeleteMapping("/me")
        public ResponseEntity<ApiResponse<Void>> deleteUser() {
                userService.deleteUser();
                return ResponseEntity.ok(ApiResponse.<Void>builder()
                                .success(true)
                                .message("Usuario eliminado correctamente")
                                .build());
        }

        @Operation(summary = "Obtiene todos los usuarios (solo administradores)")
        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
                List<UserDto> users = userService.getAllUsers();
                return ResponseEntity.ok(ApiResponse.<List<UserDto>>builder()
                                .success(true)
                                .data(users)
                                .build());
        }

        @Operation(summary = "Obtiene un usuario por ID (solo administradores)")
        @GetMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
                UserDto user = userService.getUserById(id);
                return ResponseEntity.ok(ApiResponse.<UserDto>builder()
                                .success(true)
                                .data(user)
                                .build());
        }

        @Operation(summary = "Cambia la contraseña del usuario actual")
        @PostMapping("/change-password")
        public ResponseEntity<ApiResponse<Void>> changePassword(
                        @RequestParam String currentPassword,
                        @RequestParam String newPassword) {
                userService.changePassword(currentPassword, newPassword);
                return ResponseEntity.ok(ApiResponse.<Void>builder()
                                .success(true)
                                .message("Contraseña actualizada correctamente")
                                .build());
        }

        @Operation(summary = "Sube una imagen de perfil")
        @PostMapping(value = "/me/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<String>> uploadProfilePicture(
                        @RequestParam(required = false) MultipartFile file,
                        @RequestParam(required = false) String imageUrl) throws IOException {

                String finalImageUrl = imageUrl;
                if (file != null && !file.isEmpty()) {
                        finalImageUrl = "https://example.com/profile-pictures/" + file.getOriginalFilename();
                }

                if (finalImageUrl == null || finalImageUrl.isBlank()) {
                        throw new IllegalArgumentException("Debe enviar una URL válida o una imagen.");
                }

                userService.updateProfilePicture(finalImageUrl);
                return ResponseEntity.ok(ApiResponse.<String>builder()
                                .success(true)
                                .message("Imagen de perfil actualizada correctamente")
                                .data(finalImageUrl)
                                .build());
        }
}
