package com.pethealthtracker.service.impl;

import com.pethealthtracker.dto.user.UserDto;
import com.pethealthtracker.exception.ResourceNotFoundException;
import com.pethealthtracker.mapper.UserMapper;
import com.pethealthtracker.model.User;
import com.pethealthtracker.repository.UserRepository;
import com.pethealthtracker.security.UserPrincipal;
import com.pethealthtracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        User user = getCurrentAuthenticatedUser();
        return userMapper.toDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserDto updateUser(UserDto userDto) {
        User existingUser = getCurrentAuthenticatedUser();

        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setPhone(userDto.getPhone());

        if (userDto.getProfilePictureUrl() != null) {
            String profilePictureUrl = userDto.getProfilePictureUrl().trim();
            existingUser.setProfilePictureUrl(profilePictureUrl.isEmpty() ? null : profilePictureUrl);
        }

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser() {
        User user = getCurrentAuthenticatedUser();
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserProfile() {
        return getCurrentUser();
    }

    @Override
    @Transactional
    public UserDto updateUserProfile(UserDto userDto) {
        return updateUser(userDto);
    }

    @Override
    @Transactional
    public void changePassword(String currentPassword, String newPassword) {
        User user = getCurrentAuthenticatedUser();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateProfilePicture(String imageUrl) {
        User user = getCurrentAuthenticatedUser();
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            user.setProfilePictureUrl(null);
        } else {
            user.setProfilePictureUrl(imageUrl.trim());
        }
        userRepository.save(user);
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }
}
