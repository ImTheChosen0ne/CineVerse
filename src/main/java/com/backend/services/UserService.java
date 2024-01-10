package com.backend.services;

import com.backend.exceptions.DataException;
import com.backend.models.Movie;
import com.backend.models.Profile;
import com.backend.models.Rating;
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
import java.util.Set;

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

    public Profile addProfileToUser(String email, Profile profile) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (user.getProfiles().size() >= 5) {
                throw new DataException("Maximum number of profiles reached for this user.");
            }
            profile.setLikedMovies(new HashSet<>());
            profile.setDislikedMovies(new HashSet<>());
            profile.setWatchLaterMovies(new HashSet<>());
            profile.setRatings(new HashSet<>());


            user.getProfiles().add(profile);
            userRepository.save(user);
            return profile;
        } else {
            throw new DataException("User not found with the provided ID.");
        }
    }

    public Profile updateProfile(String email, Integer profileId, Profile updatedProfile) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
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

    public Profile removeProfileFromUser(String email, Integer profileId) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        optionalUser.ifPresent(user -> {
            user.getProfiles().removeIf(profile -> profile.getProfileId().equals(profileId));
            userRepository.save(user);
        });
        return null;
    }

    public Set<Rating> movieRating(String email, Integer profileId, Rating rating) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                existingProfile.getRatings().add(rating);
                userRepository.save(user);
                return existingProfile.getRatings();
            }
        }
        return null;
    }

    public Set<Rating> removeMovieRating(String email, Integer profileId, Integer ratingId) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        optionalUser.ifPresent(user -> {
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            optionalProfile.ifPresent(profile -> {
                profile.getRatings().removeIf(rating -> rating.getRatingId().equals(ratingId));
                userRepository.save(user);
            });
        });
        return null;
    }

    public Set<Movie> likedMovie(String email, Integer profileId, Movie movie) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                existingProfile.getLikedMovies().add(movie);
                userRepository.save(user);
                return existingProfile.getLikedMovies();
            }
        }
        return null;
    }

    public Set<Movie> removeLikedMovie(String email, Integer profileId, Integer movieId) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        optionalUser.ifPresent(user -> {
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            optionalProfile.ifPresent(profile -> {
                profile.getLikedMovies().removeIf(movie -> movie.getMovieId().equals(movieId));
                userRepository.save(user);
            });
        });
        return null;
    }

    public Set<Movie> dislikedMovie(String email, Integer profileId, Movie movie) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                existingProfile.getDislikedMovies().add(movie);
                userRepository.save(user);
                return existingProfile.getDislikedMovies();
            }
        }
        return null;
    }

    public Set<Movie> removedislikedMovie(String email, Integer profileId, Integer movieId) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        optionalUser.ifPresent(user -> {
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            optionalProfile.ifPresent(profile -> {
                profile.getDislikedMovies().removeIf(movie -> movie.getMovieId().equals(movieId));
                userRepository.save(user);
            });
        });
        return null;
    }

    public Set<Movie> watchMovie(String email, Integer profileId, Movie movie) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                existingProfile.getWatchLaterMovies().add(movie);
                userRepository.save(user);
                return existingProfile.getWatchLaterMovies();
            }
        }
        return null;
    }

    public Set<Movie> removeWatchLaterMovie(String email, Integer profileId, Integer movieId) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        optionalUser.ifPresent(user -> {
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            optionalProfile.ifPresent(profile -> {
                profile.getWatchLaterMovies().removeIf(movie -> movie.getMovieId().equals(movieId));
                userRepository.save(user);
            });
        });

        return null;
    }

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + userId));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + email));
    }
}
