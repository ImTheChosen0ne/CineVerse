package com.backend.controller;

import com.backend.exceptions.DataException;
import com.backend.dto.LoginDTO;
import com.backend.models.User;
import com.backend.dto.LoginResponseDTO;
import com.backend.dto.RegistrationDTO;
import com.backend.services.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @ExceptionHandler({DataException.class})
    public ResponseEntity<String> handleException(DataException dataException) {
        return new ResponseEntity<String>(dataException.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody @Valid RegistrationDTO body) {
        return authenticationService.registerUser(body);
    }

    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody LoginDTO body) {
        return authenticationService.loginUser(body);
    }

//    @PostMapping("/login")
//    public User loginUser(@RequestBody LoginDTO body) {
//        return authenticationService.loginUser(body);
//    }

}
