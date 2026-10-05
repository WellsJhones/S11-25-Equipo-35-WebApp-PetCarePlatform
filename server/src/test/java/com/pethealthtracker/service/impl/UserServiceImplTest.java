package com.pethealthtracker.service.impl;

import com.pethealthtracker.dto.user.UserDto;
import com.pethealthtracker.mapper.UserMapper;
import com.pethealthtracker.model.User;
import com.pethealthtracker.repository.UserRepository;
import com.pethealthtracker.security.UserPrincipal;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private Authentication authentication;

    @Mock
    private UserPrincipal userPrincipal;

    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserServiceImpl(userRepository, userMapper, passwordEncoder);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getId()).thenReturn(42L);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void updateUser_shouldPersistProfilePictureUrl() {
        User existingUser = User.builder()
                .id(42L)
                .email("user@example.com")
                .password("encoded")
                .firstName("Jane")
                .lastName("Doe")
                .phone("111111111")
                .build();

        UserDto input = UserDto.builder()
                .firstName("Jane")
                .lastName("Doe")
                .phone("123456789")
                .profilePictureUrl("https://cdn.example.com/avatar.png")
                .build();

        UserDto expected = UserDto.builder()
                .id(42L)
                .email("user@example.com")
                .firstName("Jane")
                .lastName("Doe")
                .phone("123456789")
                .profilePictureUrl("https://cdn.example.com/avatar.png")
                .build();

        when(userRepository.findById(42L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(existingUser)).thenReturn(existingUser);
        when(userMapper.toDto(existingUser)).thenReturn(expected);

        UserDto result = userService.updateUser(input);

        assertEquals("https://cdn.example.com/avatar.png", existingUser.getProfilePictureUrl());
        assertEquals("https://cdn.example.com/avatar.png", result.getProfilePictureUrl());
    }
}
