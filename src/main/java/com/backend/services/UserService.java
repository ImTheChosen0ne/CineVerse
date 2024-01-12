package com.backend.services;

import com.backend.exceptions.DataException;
import com.backend.models.*;
import com.backend.repository.*;
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
    private final ProfileRatingRepository profileRatingRepository;
    private final MovieRatingRepository movieRatingRepository;
    private final ViewedRepository viewedRepository;

    public UserService(UserRepository userRepository, ProfileRepository profileRepository, MovieRepository movieRepository, ProfileRatingRepository profileRatingRepository, MovieRatingRepository movieRatingRepository, ViewedRepository viewedRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.movieRepository = movieRepository;
        this.profileRatingRepository = profileRatingRepository;
        this.movieRatingRepository = movieRatingRepository;
        this.viewedRepository = viewedRepository;
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
            profile.setWatchLaterMovies(new HashSet<>());
            profile.setProfileRatings(new HashSet<>());

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

    public ProfileRating movieRating(String email, Integer profileId, ProfileRating profileRating) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                Movie movie = movieRepository.findById(profileRating.getMovie().getMovieId()).orElse(null);

                if (movie != null) {
                    profileRating.setMovie(movie);
                    existingProfile.getProfileRatings().add(profileRating);
                    ProfileRating savedProfileRating = profileRatingRepository.save(profileRating);

                    MovieRating movieRating = new MovieRating(profileRating.getRatingId(), profileRating.getRating(), profileRating.getDate());
                    movie.getRatings().add(movieRating);
                    MovieRating savedMovieRating = movieRatingRepository.save(movieRating);


                    movieRepository.save(movie);
                    profileRepository.save(existingProfile);
                    return savedProfileRating;
                }
            }
        }
        return null;
    }

    public ProfileRating updateMovieRating(String email, Integer profileId, Integer ratingId, ProfileRating updatedProfileRating) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                Optional<ProfileRating> optionalExistingRating = existingProfile.getProfileRatings().stream()
                        .filter(rating -> rating.getRatingId().equals(ratingId))
                        .findFirst();

                if (optionalExistingRating.isPresent()) {
                    ProfileRating existingProfileRating = optionalExistingRating.get();

                    Movie movie = movieRepository.findById(existingProfileRating.getMovie().getMovieId()).orElse(null);

                    Optional<MovieRating> optionalMovieRating = movie.getRatings().stream()
                            .filter(rating -> rating.getRatingId().equals(ratingId))
                            .findFirst();

                    if (optionalMovieRating.isPresent()) {
                        MovieRating existingMovieRating = optionalMovieRating.get();

                        existingMovieRating.setRating(updatedProfileRating.getRating());
                        existingMovieRating.setDate(updatedProfileRating.getDate());

                        movieRatingRepository.save(existingMovieRating);
                        movieRepository.save(movie);
                    }

                    existingProfileRating.setRating(updatedProfileRating.getRating());
                    existingProfileRating.setDate(updatedProfileRating.getDate());

                    ProfileRating updateRating = profileRatingRepository.save(existingProfileRating);
                    profileRepository.save(existingProfile);
                    return updateRating;
                }
            }
        }
        return null;
    }

    public ProfileRating removeMovieRating(String email, Integer profileId, Integer ratingId) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile profile = optionalProfile.get();

                Optional<ProfileRating> optionalRatingToRemove = profile.getProfileRatings().stream()
                        .filter(rating -> rating.getRatingId().equals(ratingId))
                        .findFirst();

                if (optionalRatingToRemove.isPresent()) {
                    ProfileRating removedProfileRating = optionalRatingToRemove.get();

                    Movie movie = movieRepository.findById(removedProfileRating.getMovie().getMovieId()).orElse(null);

                    Optional<MovieRating> optionalMovieRating = movie.getRatings().stream()
                            .filter(rating -> rating.getRatingId().equals(ratingId))
                            .findFirst();

                    if (optionalMovieRating.isPresent()) {
                        MovieRating removedMovieRating = optionalMovieRating.get();

                        movie.getRatings().remove(removedMovieRating);
                        movieRepository.save(movie);
                        movieRatingRepository.deleteById(ratingId);
                    }

                    profile.getProfileRatings().remove(removedProfileRating);
                    profileRepository.save(profile);
                    profileRatingRepository.deleteById(ratingId);
                }
            }
        }
        return null;
    }

    public Movie watchMovie(String email, Integer profileId, Movie movie) {
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
                return movie;
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

    public Viewed viewedMovie(String email, Integer profileId, Viewed viewed) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                Movie movie = movieRepository.findById(viewed.getMovie().getMovieId()).orElse(null);

                if (movie != null) {
                    viewed.setMovie(movie);
                    existingProfile.getViewedMovies().add(viewed);
                    Viewed savedViewed = viewedRepository.save(viewed);

                    profileRepository.save(existingProfile);
                    return savedViewed;
                }
            }
        }
        return null;
    }

    public Viewed updateViewedMovie(String email, Integer profileId, Integer viewedId, Viewed updatedViewedMovie) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Profile> optionalProfile = user.getProfiles().stream()
                    .filter(profile -> profile.getProfileId().equals(profileId))
                    .findFirst();

            if (optionalProfile.isPresent()) {
                Profile existingProfile = optionalProfile.get();
                Optional<Viewed> optionalExistingView = existingProfile.getViewedMovies().stream()
                        .filter(rating -> rating.getViewedId().equals(viewedId))
                        .findFirst();

                if (optionalExistingView.isPresent()) {
                    Viewed existingProfileView = optionalExistingView.get();

                    Movie movie = movieRepository.findById(existingProfileView.getMovie().getMovieId()).orElse(null);

                    if (movie != null) {
                        movie.setViews(movie.getViews() + 1);
                        movieRepository.save(movie);
                    }

                    existingProfileView.setDate(updatedViewedMovie.getDate());

                    Viewed updateView = viewedRepository.save(updatedViewedMovie);
                    profileRepository.save(existingProfile);
                    return updateView;
                }
            }
        }
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
