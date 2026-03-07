package com.thaiglocal.server.controller;

import java.io.IOException;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thaiglocal.server.dto.request.SignInRequest;
import com.thaiglocal.server.dto.request.SignUpRequest;
import com.thaiglocal.server.dto.request.UserRequest;
import com.thaiglocal.server.dto.response.SignInResponse;
import com.thaiglocal.server.dto.response.UserResponse;
import com.thaiglocal.server.model.User;
import com.thaiglocal.server.security.CustomUserDetails;
import com.thaiglocal.server.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api")
public class UserController {    
    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> pathMyProfile(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @RequestBody UserRequest request
    ) {
        Long userId = currentUser.getId();

        return new ResponseEntity<UserResponse>(userService.getUserById(userId), HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<SignInResponse> signIn(
        @RequestBody SignInRequest request,
        HttpServletResponse eResponse
    ) throws IOException {
        SignInResponse response = userService.signIn(request);

        ResponseCookie refreshCookie = ResponseCookie.from(response.getRefreshToken(), response.getAccessToken())
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/api")
            .maxAge(Duration.ofDays(7))
            .build();
        
        eResponse.addHeader("Set-Cookie", refreshCookie.toString());

        response.setRefreshToken(null);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(
        @RequestBody SignUpRequest request,
        HttpServletResponse eResponse
    ) throws IOException {
        return ResponseEntity.ok(userService.singUp(request)) ;
    }
    
    
}
