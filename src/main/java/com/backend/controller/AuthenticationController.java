package com.backend.controller;

import com.backend.exceptions.DataException;
import com.backend.dto.LoginDTO;
import com.backend.models.User;
import com.backend.dto.ResponseDTO;
import com.backend.dto.RegistrationDTO;
import com.backend.services.AuthenticationService;
import com.backend.services.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final TokenService tokenService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService, TokenService tokenService) {
        this.authenticationService = authenticationService;
        this.tokenService = tokenService;
    }

    @ExceptionHandler({DataException.class})
    public ResponseEntity<String> handleException(DataException dataException) {
        return new ResponseEntity<String>(dataException.getMessage(), HttpStatus.CONFLICT);
    }

//    @ExceptionHandler({DataException.class})
//    public ResponseEntity<Map<String, String>> handleException(DataException dataException) {
//        Map<String, String> errorResponse = new HashMap<>();
//        errorResponse.put("error", dataException.getMessage());
//        return ResponseEntity
//                .status(HttpStatus.FORBIDDEN)
//                .contentType(MediaType.APPLICATION_JSON)
//                .body(errorResponse);
//    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }

//    @GetMapping("/")
//    public UserDetails getUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
//        String username = tokenService.getUserNameFromToken(token);
//        return authenticationService.loadUserByUsername(username);
//    }

    @GetMapping("/")
    public ResponseEntity<Object> getUser(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            // No Authorization header or it doesn't start with "Bearer"
            // Handle the case where no token is present, maybe return some public information
            return ResponseEntity.ok("Welcome to the public route!");
        }

        String username = tokenService.getUserNameFromToken(token);
        UserDetails userDetails = authenticationService.loadUserByUsername(username);

        // Return user details or any other data for authenticated users
        return ResponseEntity.ok(userDetails);
    }

    @PostMapping("/register")
    public ResponseDTO registerUser(@RequestBody @Valid RegistrationDTO body) { return authenticationService.registerUser(body); }

    @PostMapping("/login")
    public ResponseDTO loginUser(@RequestBody LoginDTO body) {
        return authenticationService.loginUser(body);
    }

    @GetMapping("/logout")
    public User logOut() { return null; }

}
