package com.thaiglocal.server.Services;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thaiglocal.server.Model.User;
import com.thaiglocal.server.Repository.UserRepository;
import com.thaiglocal.server.dto.SignInRequest;
import com.thaiglocal.server.dto.SignInResponse;
import com.thaiglocal.server.dto.SignUpRequest;
import com.thaiglocal.server.dto.UserRequest;
import com.thaiglocal.server.dto.UserResponse;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // login
    public SignInResponse signIn(SignInRequest request) {
        String loginId = request.getUsernameOrEmail();

        User user = userRepository.findByUsernameOrEmail(loginId, loginId)
            .orElseThrow(() -> new RuntimeException("User not found."));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Username, Email or Password");
        }

        return new SignInResponse(
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }

    public String singUp(SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }

        // create user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setTelephone(request.getTelephone());
        user.setAddress(request.getAddress());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setBirtDate(Date.valueOf(request.getBirthDate()));
        user.setCreatedAt(new Date(System.currentTimeMillis()));

        userRepository.save(user);
        return "User registered successfully";
    }

    public UserResponse updateUser(Long userId, UserRequest request) {
        User existingUser = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Invalid user Id."));
        
        if (request.username() != null && !request.username().isBlank()) {
            existingUser.setUsername(request.username());
        }
        if (request.email() != null && !request.email().isBlank()) {
            existingUser.setEmail(request.email());
        }
        if (request.firstName() != null && !request.firstName().isBlank()) {
            existingUser.setFirstName(request.firstName());
        }
        if (request.lastName() != null && !request.lastName().isBlank()) {
            existingUser.setLastName(request.lastName());
        }
        if (request.telephone() != null && !request.telephone().isBlank()) {
            existingUser.setTelephone(request.telephone());
        }
        if (request.address() != null && !request.address().isBlank()) {
            existingUser.setAddress(request.address());
        }
        if (request.birtDate() != null) {
            existingUser.setBirtDate(new Date(request.birtDate().getTime()));
        }
        if (request.isActive() != null) {
            existingUser.setIsActive(request.isActive());
        }

        return mapToUserResponse(existingUser);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invalid user id"));

        return mapToUserResponse(user);
    }

    public List<UserResponse> getAllUser() {
        List<User> users = userRepository.findAll();
        
        return users.stream().map(user -> {
            return mapToUserResponse(user);
        }).toList();
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole(),
            user.getTelephone(),
            user.getAddress(),
            user.getBirtDate(),
            user.getCreatedAt(),
            user.getDeleteAt(),
            user.getIsActive()
        );
    }

    // update user (patch) /
    // delete user (delete) /
    // get user data (get) /
    
    // jwt use userId, role, expired, create at, create from
}
