package com.pethealthtracker.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.pethealthtracker.dto.ApiResponse;
import com.pethealthtracker.dto.auth.GoogleTokenDTO;
import com.pethealthtracker.dto.auth.JwtAuthResponse;
import com.pethealthtracker.dto.auth.LoginRequest;
import com.pethealthtracker.dto.auth.RegisterRequest;
import com.pethealthtracker.model.User;
import com.pethealthtracker.repository.UserRepository;
import com.pethealthtracker.security.JwtTokenProvider;
import com.pethealthtracker.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import com.pethealthtracker.security.UserPrincipal;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.util.StreamUtils;
import org.springframework.validation.annotation.Validated;
/**
 * Controlador para gestionar autenticación y registro de usuarios.
 * Proporciona endpoints para inicio de sesión, registro, recuperación de contraseña y verificación de correo electrónico.
 * 
 * @apiNote Tabla de base de datos: users
 */
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import jakarta.validation.Valid;

@Tag(name = "Autenticación (users)", description = "API para autenticación y gestión de cuentas")
@Validated
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${GOOGLE_CLIENT_ID_ANDROID:dummy_android_client_id}")
    private String googleClientId;

    @Value("${app.oauth.default-password}")
    private String oauthDefaultPassword;

    @Value("classpath:html/verify_success.html")
    private Resource successHtmlResource;

    @Value("classpath:html/verify_error.html")
    private Resource errorHtmlResource;

    @Value("classpath:html/reset_password.html")
    private Resource resetPasswordHtmlResource;

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "Autentica un usuario y devuelve un token JWT")
    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.<JwtAuthResponse>builder()
                .success(true)
                .message("Inicio de sesión exitoso")
                .data(response)
                .build());
    }

    @Operation(summary = "Registra un nuevo usuario en el sistema")
    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> registerUser(
            @Valid @RequestBody RegisterRequest registerRequest) {
        JwtAuthResponse response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(ApiResponse.<JwtAuthResponse>builder()
                .success(true)
                .message("Usuario registrado exitosamente")
                .data(response)
                .build());
    }

    @Operation(summary = "Solicita el restablecimiento de contraseña")
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @RequestParam @NotBlank @Email String email) {
        authService.requestPasswordReset(email);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message(
                        "Se ha enviado un enlace de restablecimiento de contraseña al correo electrónico proporcionado")
                .build());
    }

    @Operation(summary = "Restablece la contraseña usando el token recibido en el email")
    @PostMapping("/auth/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestParam @NotBlank String token,
            @RequestParam @NotBlank String newPassword) {

        authService.resetPassword(token, newPassword);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Contraseña restablecida exitosamente")
                .build());
    }

    @GetMapping("/auth/change-password-page")
    public ResponseEntity<String> showChangePassword(@RequestParam("token") String token) {
        try {
            String htmlContent = StreamUtils.copyToString(
                    resetPasswordHtmlResource.getInputStream(),
                    StandardCharsets.UTF_8);

            return ResponseEntity.ok().body(htmlContent);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error cargando la página");
        }
    };

    @Operation(summary = "Verifica el correo electrónico del usuario usando el token de verificación")
    @GetMapping("/auth/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        boolean isVerified = authService.verifyEmail(token);

        Resource resouceToLoad = isVerified ? successHtmlResource : errorHtmlResource;
        try {
            String htmlContent = StreamUtils.copyToString(
                    resouceToLoad.getInputStream(),
                    StandardCharsets.UTF_8);

            if (isVerified) {
                return ResponseEntity.ok(htmlContent);
            } else {
                return ResponseEntity.badRequest().body(htmlContent);
            }

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error cargando la página");
        }
    }

    @Operation(summary = "Iniciar Sesión con Google para Web.", description = "Redirige al usuario a la página de autenticación de Google."
            +
            "⚠️ **IMPORTANTE:** Este endpoint NO debe ser llamado con AJAX/Axios. " +
            "El frontend debe navegar directamente a esta URL o usar un enlace.")
    @GetMapping("/google/web")
    public void googleLogin(@RequestParam String param) {
    }

    @Operation(summary = "Registrar/Login Usuario con Google (Móvil).", description = "Recibe el ID Token de Google desde la app móvil, lo verifica y devuelve un JWT de la aplicación.", responses = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Autenticación exitosa", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                    {
                        "message": "Login exitoso",
                        "token": "BearerToken",
                        "usuario": "Juan"
                    }
                    """)))
    })
    @PostMapping("/google/mobile")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleTokenDTO tokenDto) {
        try {
            // 1. Configurar el verificador de Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // 2. Verificar el token recibido desde React Native
            GoogleIdToken idToken = verifier.verify(tokenDto.getIdToken());

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                // 3. Extraer info del usuario
                String email = payload.getEmail();
                String firstName = (String) payload.get("given_name");
                String lastName = (String) payload.get("family_name");

                if (firstName == null)
                    firstName = "User";
                if (lastName == null)
                    lastName = "-";

                final String finalFirstName = firstName;
                final String finalLastName = lastName;

                // 4. Buscar o Crear usuario en tu BD
                User user = userRepository.findByEmail(email).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirstName(finalFirstName);
                    newUser.setLastName(finalLastName);
                    newUser.setPassword(oauthDefaultPassword);
                    newUser.setEmailVerified(true);
                    newUser.setCreatedBy("Google Inc");
                    return userRepository.save(newUser);
                });

                // 5. Convertir User a UserPrincipal
                // ! IMPORTANTE: JwtTokenProvider espera un UserPrincipal para extraer el ID.
                UserPrincipal userPrincipal = UserPrincipal.create(user);

                // 6. Crear la autenticación con el UserPrincipal
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userPrincipal, null, userPrincipal.getAuthorities());

                // 7. Generar el token (ahora entrará en el "Caso 1" de tu Provider)
                String appJwt = jwtTokenProvider.generateToken(authentication);

                // 8. Responder al celular
                return ResponseEntity.ok(Map.of(
                        "token", appJwt,
                        "email", user.getEmail(),
                        "usuario", user.getFirstName()));

            } else {
                return ResponseEntity.status(401).body("Token de Google inválido");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error en autenticación Google: " + e.getMessage());
        }
    }
}
