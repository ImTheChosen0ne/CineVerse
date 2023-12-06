package com.backend.services;

import com.backend.exceptions.DataException;
import com.backend.models.Movie;
import com.backend.models.User;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

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

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + userId));
    }

    public Set<Movie> likedMovie(String username, Movie movie) {
        User loggedInUser = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
        Set<Movie> likedList = loggedInUser.getLikedMovies();

        likedList.add(movie);
        loggedInUser.setLikedMovies(likedList);

        userRepository.save(loggedInUser);
        return loggedInUser.getLikedMovies();
    }

    public Set<Movie> watchMovie(String username, Movie movie) {
        User loggedInUser = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
        Set<Movie> watchList = loggedInUser.getWatchLaterMovies();

        watchList.add(movie);
        loggedInUser.setLikedMovies(watchList);

        userRepository.save(loggedInUser);
        return loggedInUser.getWatchLaterMovies();
    }

    public Set<Movie> getLikedMoviesList(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
        return user.getLikedMovies();
    }

    public Set<Movie> getWatchMoviesList(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
        return user.getWatchLaterMovies();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }
}
