package com.backend.services;

import com.backend.exceptions.DataException;
import com.backend.models.Movie;
import com.backend.models.Profile;
import com.backend.models.Rating;
import com.backend.models.User;
import com.backend.repository.MovieRepository;
import com.backend.repository.ProfileRepository;
import com.backend.repository.RatingRepository;
import com.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private PasswordEncoder encoder;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final MovieRepository movieRepository;
    private final RatingRepository ratingRepository;

    public UserService(UserRepository userRepository, ProfileRepository profileRepository, MovieRepository movieRepository, RatingRepository ratingRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.movieRepository = movieRepository;
        this.ratingRepository = ratingRepository;
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
//            profile.setLikedMovies(new HashSet<>());
//            profile.setDislikedMovies(new HashSet<>());
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

    public Rating movieRating(String email, Integer profileId, Rating rating) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                Movie movie = movieRepository.findById(rating.getMovie().getMovieId()).orElse(null);

                if (movie != null) {
                    rating.setMovie(movie);
                    existingProfile.getRatings().add(rating);
                    Rating savedRating = ratingRepository.save(rating);

                    profileRepository.save(existingProfile);
                    return savedRating;
                }
            }
        }
        return null;
    }

    public Set<Rating> updateMovieRating(String email, Integer profileId, Integer ratingId, Rating updatedRating) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                Optional<Rating> optionalExistingRating = existingProfile.getRatings().stream()
                        .filter(rating -> rating.getRatingId().equals(ratingId))
                        .findFirst();

                if (optionalExistingRating.isPresent()) {

                    Rating existingRating = optionalExistingRating.get();

                    existingRating.setRating(updatedRating.getRating());
                    existingRating.setDate(updatedRating.getDate());

                    ratingRepository.save(existingRating);
                }

                profileRepository.save(existingProfile);
                return existingProfile.getRatings();
            }
        }
        return null;
    }

    public Rating removeMovieRating(String email, Integer profileId, Integer ratingId) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile profile = optionalProfile.get();

                Optional<Rating> optionalRatingToRemove = profile.getRatings().stream()
                        .filter(rating -> rating.getRatingId().equals(ratingId))
                        .findFirst();

                if (optionalRatingToRemove.isPresent()) {
                    Rating removedRating = optionalRatingToRemove.get();

                    profile.getRatings().remove(removedRating);
                    profileRepository.save(profile);
                    ratingRepository.deleteById(ratingId);
                }
            }
        }
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
