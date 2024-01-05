package com.backend.services;

import com.backend.exceptions.DataException;
import com.backend.models.Profile;
import com.backend.models.User;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private PasswordEncoder encoder;

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User updateUser(User user) {
        try {
            return userRepository.save(user);
        } catch (DataException e) {
            throw new DataException("Email already in use.");
        }
    }

    public Profile addProfileToUser(Integer userId, Profile profile) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (user.getProfiles().size() >= 5) {
                throw new DataException("Maximum number of profiles reached for this user.");
            }
            profile.setLikedMovies(new HashSet<>());
            profile.setWatchLaterMovies(new HashSet<>());

            user.getProfiles().add(profile);
            userRepository.save(user);
            return profile;
        } else {
            throw new DataException("User not found with the provided ID.");
        }
    }

    public Profile updateProfile(Integer userId, Integer profileId, Profile updatedProfile) {
        Optional<User> optionalUser = userRepository.findById(userId);
        optionalUser.ifPresent(user -> {
            user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst()
                    .ifPresent(existingProfile -> {
                        existingProfile.setName(updatedProfile.getName());
                        existingProfile.setImg(updatedProfile.getImg());

                        userRepository.save(user);
                    });
        });
        return updatedProfile;
    }

    public Profile removeProfileFromUser(Integer userId, Integer profileId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        optionalUser.ifPresent(user -> {
            user.getProfiles().removeIf(profile -> profile.getProfileId().equals(profileId));
            userRepository.save(user);
        });
        return null;
    }


    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + userId));
    }

//    public Set<Movie> likedMovie(String email, Movie movie) {
//        User loggedInUser = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + email));
//        Set<Movie> likedList = loggedInUser.getProfiles().;
//
//        likedList.add(movie);
//        loggedInUser.setLikedMovies(likedList);
//
//        userRepository.save(loggedInUser);
//        return loggedInUser.getLikedMovies();
//    }
//
//    public Set<Movie> watchMovie(String email, Movie movie) {
//        User loggedInUser = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + email));
//        Set<Movie> watchList = loggedInUser.getWatchLaterMovies();
//
//        watchList.add(movie);
//        loggedInUser.setLikedMovies(watchList);
//
//        userRepository.save(loggedInUser);
//        return loggedInUser.getWatchLaterMovies();
//    }
//
//    public Set<Movie> getLikedMoviesList(String email) {
//        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + email));
//        return user.getLikedMovies();
//    }
//
//    public Set<Movie> getWatchMoviesList(String email) {
//        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + email));
//        return user.getWatchLaterMovies();
//    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + email));
    }
}
