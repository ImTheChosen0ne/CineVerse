package com.backend.controller;

import com.backend.exceptions.DataException;
import com.backend.models.*;
import com.backend.services.TokenService;
import com.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {
    private final UserService userService;
    private final TokenService tokenService;

    @Autowired
    public UserController(UserService userService, TokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }

    @ExceptionHandler({DataException.class})
    public ResponseEntity<String> handleException(DataException dataException) {
        return new ResponseEntity<>(dataException.getMessage(), HttpStatus.CONFLICT);
    }

    @GetMapping("/")
    public UserDetails getUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        String username = tokenService.getEmailFromToken(token);
        return userService.loadUserByUsername(username);
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody User body) {
        return userService.updateUser(body);
    }

    @PostMapping("/profiles/new")
    public Profile addProfileToUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestBody Profile profile) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        try {
            return userService.addProfileToUser(loggedInUser, profile);
        } catch (DataException e) {
            throw new DataException("");
        }
    }

    @PutMapping("/profiles/{profileId}")
    public Profile updateProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @RequestBody Profile updatedProfile) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.updateProfile(loggedInUser, profileId, updatedProfile);
    }

    @DeleteMapping("/profiles/{profileId}")
    public Profile removeProfileFromUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.removeProfileFromUser(loggedInUser, profileId);
    }

    @PostMapping("/profiles/{profileId}/rating/add")
    public ProfileRating movieRating(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @RequestBody ProfileRating profileRating) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.movieRating(loggedInUser, profileId, profileRating);
    }

    @PutMapping("/profiles/{profileId}/rating/{ratingId}/update")
    public ProfileRating updateMovieRating(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @PathVariable Integer ratingId, @RequestBody ProfileRating profileRating) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.updateMovieRating(loggedInUser, profileId, ratingId, profileRating);
    }


    @DeleteMapping("/profiles/{profileId}/rating/{ratingId}/delete")
    public ProfileRating removeMovieRating(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @PathVariable Integer ratingId) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.removeMovieRating(loggedInUser, profileId, ratingId);
    }

    @PutMapping("/profiles/{profileId}/watch_later/add")
    public Movie watchMovie(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @RequestBody Movie movie) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.watchMovie(loggedInUser, profileId, movie);
    }

    @DeleteMapping("/profiles/{profileId}/watch_later/{movieId}/delete")
    public Set<Movie> removeWatchLaterMovie(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @PathVariable Integer movieId) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.removeWatchLaterMovie(loggedInUser, profileId, movieId);
    }

    @PostMapping("/profiles/{profileId}/viewed/add")
    public Viewed viewedMovie(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @RequestBody Viewed viewed) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.viewedMovie(loggedInUser, profileId, viewed);
    }

    @PutMapping("/profiles/{profileId}/viewed/{viewedId}/update")
    public Viewed updateMovieRating(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @PathVariable Integer viewedId, @RequestBody Viewed viewed) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.updateViewedMovie(loggedInUser, profileId, viewedId, viewed);
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
