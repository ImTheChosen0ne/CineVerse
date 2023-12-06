package com.backend.exceptions;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;


//@Component("customAuthenticationEntryPoint")
//public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
//
//    @Override
//    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authenticationException)
//            throws IOException, ServletException {
//
//        String errorMessage;
//
//        if (authenticationException instanceof BadCredentialsException) {
//            response.setContentType("application/json");
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            errorMessage = "Invalid username or password";
//        } else if (authenticationException instanceof InsufficientAuthenticationException) {
//            response.setContentType("application/json");
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            errorMessage = "All registration fields must be provided";
//        } else {
//            errorMessage = authenticationException.getMessage();
//        }
//
//        response.setContentType("application/json");
//        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//        response.getOutputStream().println("{ \"message\": \"" + errorMessage + "\" }");
//    }
//}