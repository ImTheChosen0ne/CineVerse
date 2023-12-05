package com.backend.services;

import com.backend.exceptions.DataException;
import com.backend.models.Movie;
import com.backend.models.User;
import com.backend.models.LoginResponseDTO;
import com.backend.models.Role;
import com.backend.repository.MovieRepository;
import com.backend.repository.RoleRepository;
import com.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MovieRepository movieRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    public AuthenticationService(UserRepository userRepository, RoleRepository roleRepository, MovieRepository movieRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.movieRepository = movieRepository;
    }

    public User registerUser(String username, String password, String firstName, String lastName, String email) {
        validateRegistrationInput(username, password, firstName, lastName, email);

        String encodedPassword = passwordEncoder.encode(password);
        Role userRole = roleRepository.findByAuthority("USER").get();

        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);

        Movie movie = movieRepository.findByTitle("Avatar").get();
        Set<Movie> likedMovies = new HashSet<>();

        Movie watchMovie = movieRepository.findByTitle("Avatar").get();
        Set<Movie> watchLaterMovies = new HashSet<>();


        return userRepository.save(new User(0, username, encodedPassword, firstName, lastName, email, authorities, likedMovies, watchLaterMovies));
    }

    public LoginResponseDTO loginUser(String username, String password) {

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            String token = tokenService.generateJwt(auth);

            return new LoginResponseDTO(userRepository.findByUsername(username).get(), token);

        } catch (DataException e) {
            throw new DataException("Invalid credentials: " + e.getMessage(), e);
        }
    }

    private void validateRegistrationInput(String username, String password, String firstName, String lastName, String email) {
        if (username.isEmpty() || password.isEmpty() || firstName.isEmpty()
                || lastName.isEmpty() || email.isEmpty()) {
            throw new DataException("All registration fields must be provided");
        }
    }

}
