package com.backend.services;

import com.backend.dto.LoginDTO;
import com.backend.dto.ResponseDTO;
import com.backend.dto.RegistrationDTO;
import com.backend.exceptions.DataException;
import com.backend.models.*;
import com.backend.repository.RoleRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;

    public AuthenticationService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public ResponseDTO registerUser(RegistrationDTO body) {

        User user = new User();
        user.setUsername(body.getUsername());
        user.setPassword(passwordEncoder.encode(body.getPassword()));
        user.setFirstName(body.getFirstName());
        user.setLastName(body.getLastName());
        user.setEmail(body.getEmail());

        Set<Movie> likedMovies = new HashSet<>();
        user.setLikedMovies(likedMovies);

        Set<Movie> watchLaterMovies = new HashSet<>();
        user.setWatchLaterMovies(watchLaterMovies);

        Role userRole = roleRepository.findByAuthority("USER").get();
        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);
        user.setAuthorities(authorities);

        try {
            User newUser = userRepository.save(user);

            Authentication auth = new UsernamePasswordAuthenticationToken(body.getUsername(), body.getPassword());
            String token = tokenService.generateJwt(auth);

            return new ResponseDTO(newUser, token);
        } catch(Exception e) {
            throw new DataException("Email already in use.");
        }
    }

    public ResponseDTO loginUser(LoginDTO body) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(body.getUsername(), body.getPassword())
            );

            String token = tokenService.generateJwt(auth);

            return new ResponseDTO(userRepository.findByUsername(body.getUsername()).get(), token);

        } catch (BadCredentialsException e) {
            throw new DataException("Invalid credentials");
        }
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }
}
