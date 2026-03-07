package com.thaiglocal.server.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thaiglocal.server.Services.UserService;
import com.thaiglocal.server.dto.UserResponse;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {
    
    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public UserResponse getMethodName(@AuthenticationPrincipal ) {
        return new String();
    }
    
    
}
