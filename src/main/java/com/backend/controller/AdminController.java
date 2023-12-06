package com.backend.controller;

import com.backend.services.TokenService;
import com.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")

public class AdminController {
    private final UserService userService;
    private final TokenService tokenService;

    @Autowired
    public AdminController(UserService userService, TokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }

    public UserDetails getAdmin(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        String username = tokenService.getUserNameFromToken(token);
        return userService.loadUserByUsername(username);
    }

}
