package com.backend.controller;

import com.backend.dto.VerifyEmailDTO;
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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
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

    @GetMapping("/")
    public UserDetails getUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        String email = tokenService.getEmailFromToken(token);
        return authenticationService.loadUserByEmail(email);
    }

    @PostMapping("/register")
    public ResponseDTO registerUser(@RequestBody @Valid RegistrationDTO body) {
        return authenticationService.registerUser(body);
    }

    @PostMapping("/email_verification")
    public ResponseEntity<?> emailVerification(@RequestBody @Valid VerifyEmailDTO request) {
        User user = authenticationService.verifyUserEmail(request.getEmail());
        if (user != null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "User already exists for email: " + request.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } else {
            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("success", "Verification successful");
            return ResponseEntity.ok(successResponse);
        }
    }

    @PostMapping("/login")
    public ResponseDTO loginUser(@RequestBody LoginDTO body) {
        return authenticationService.loginUser(body);
    }

    @GetMapping("/logout")
    public User logOut() { return null; }

}
