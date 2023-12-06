package com.backend.controller;

import com.backend.exceptions.DataException;
import com.backend.models.LoginDTO;
import com.backend.models.Movie;
import com.backend.models.User;
import com.backend.repository.UserRepository;
import com.backend.services.TokenService;
import com.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final TokenService tokenService;

    private User users;
    @Autowired
    public UserController(UserService userService, TokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }

    @ExceptionHandler({DataException.class})
    public ResponseEntity<String> handleException(DataException dataException) {
        return new ResponseEntity<String>(dataException.getMessage(), HttpStatus.CONFLICT);
    }

    @GetMapping("/")
    public UserDetails getUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        String username = tokenService.getUserNameFromToken(token);

        return userService.loadUserByUsername(username);
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody User body) {
        return userService.updateUser(body);
    }

    @PutMapping("/like")
    public Set<Movie> likedMovie(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestBody Movie movie) {
        String loggedInUser = tokenService.getUserNameFromToken(token);

        return userService.likedMovie(loggedInUser, movie);
    }

    @PutMapping("/watch")
    public Set<Movie> watchMovie(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestBody Movie movie) {
        String loggedInUser = tokenService.getUserNameFromToken(token);

        return userService.watchMovie(loggedInUser, movie);
    }

    @GetMapping("/movies/liked/{username}")
    public Set<Movie> getLikedMovies(@PathVariable("username") String username) {
        return userService.getLikedMoviesList(username);
    }

    @GetMapping("/movies/watchlater/{username}")
    public Set<Movie> getWatchLaterMovies(@PathVariable("username") String username) {
        return userService.getWatchMoviesList(username);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<User> getUser(@PathVariable("id") Integer id, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
//        try {
//            // Validate token
//            String username = validateToken(token);
//
//            // Load user by username
//            User user = userService.loadUserByUsername(username);
//
//            // Check if the loaded user matches the requested user id
//            if (user.getUserId().equals(id)) {
//                return ResponseEntity.ok(user);
//            } else {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//    }
//
//    private String validateToken(String token) throws Exception {
//        if (token == null || !token.startsWith("Bearer ")) {
//            throw new Exception("Invalid token");
//        }
//
//        String strippedToken = token.substring(7);
//        return tokenService.getUserNameFromToken(strippedToken);
//    }

//    @PutMapping("/{id}/update/")
//    public User updateUser(@RequestBody User body, @PathVariable("id") Integer id) {
//        User user = userService.getUserById(id);
//
//        String username = body.getUsername();
//        String email = body.getEmail();
//        String firstName = body.getFirstName();
//        String lastName = body.getLastName();
//
////        String phone = body.get("phone");
//
////        user.setPhone(phone);
//        user.setUsername(body.getUsername());
//        user.setFirstName(body.getFirstName());
//        user.setLastName(body.getLastName());
//        user.setEmail(body.getEmail());
//
//
//        return userService.updateUser(user);
//
//    }
}
