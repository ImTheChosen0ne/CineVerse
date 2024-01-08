package com.backend.controller;

import com.backend.exceptions.DataException;
import com.backend.models.Movie;
import com.backend.models.Profile;
import com.backend.models.User;
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
        return new ResponseEntity<String>(dataException.getMessage(), HttpStatus.CONFLICT);
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

    @PutMapping("/profiles/{profileId}/like/add")
    public Set<Movie> likedMovie(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @RequestBody Movie movie) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.likedMovie(loggedInUser, profileId, movie);
    }

    @DeleteMapping("/profiles/{profileId}/like/delete")
    public Set<Movie> removeLikedMovie(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @RequestBody Movie movie) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.removeLikedMovie(loggedInUser, profileId, movie);
    }

    @PutMapping("/profiles/{profileId}/watchlater/add")
    public Set<Movie> watchMovie(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @RequestBody Movie movie) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.watchMovie(loggedInUser, profileId, movie);
    }

    @DeleteMapping("/profiles/{profileId}/watchlater/delete")
    public Set<Movie> removeWatchLaterMovie(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable Integer profileId, @RequestBody Movie movie) {
        String loggedInUser = tokenService.getEmailFromToken(token);
        return userService.removeWatchLaterMovie(loggedInUser, profileId, movie);
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
