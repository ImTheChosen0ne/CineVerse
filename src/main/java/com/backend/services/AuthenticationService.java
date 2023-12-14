package com.backend.services;

import com.backend.dto.LoginDTO;
import com.backend.dto.ResponseDTO;
import com.backend.dto.RegistrationDTO;
import com.backend.exceptions.DataException;
import com.backend.models.*;
import com.backend.repository.ProfileRepository;
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
    private final ProfileRepository profileRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;

    public AuthenticationService(UserRepository userRepository, RoleRepository roleRepository, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.profileRepository = profileRepository;
    }

    public ResponseDTO registerUser(RegistrationDTO body) {

        User user = new User();
//        user.setUsername(body.getUsername());
        user.setEmail(body.getEmail());
        user.setPassword(passwordEncoder.encode(body.getPassword()));
        user.setFirstName(body.getFirstName());
        user.setLastName(body.getLastName());

        Set<Movie> likedMovies = new HashSet<>();
        user.setLikedMovies(likedMovies);

        Set<Movie> watchLaterMovies = new HashSet<>();
        user.setWatchLaterMovies(watchLaterMovies);

        Profile profile = new Profile(0, user.getFirstName(), "img");
        Profile profiles = profileRepository.save(profile);

        Set<Profile> userProfile = new HashSet<>();
        userProfile.add(profiles);

        user.setProfiles(userProfile);

        Role userRole = roleRepository.findByAuthority("USER").get();
        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);
        user.setAuthorities(authorities);

        try {
            User newUser = userRepository.save(user);

            Authentication auth = new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword());
            String token = tokenService.generateJwt(auth);

            return new ResponseDTO(newUser, token);
        } catch(Exception e) {
            throw new DataException("Email already in use.");
        }
    }

    public ResponseDTO loginUser(LoginDTO body) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword())
            );

            String token = tokenService.generateJwt(auth);

            return new ResponseDTO(userRepository.findByEmail(body.getEmail()).get(), token);

        } catch (BadCredentialsException e) {
            throw new DataException("Invalid credentials");
        }
    }

    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + email));
    }
}
