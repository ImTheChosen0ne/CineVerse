package com.backend.configuration;

import com.backend.exceptions.DataException;
import com.backend.models.*;
import com.backend.repository.MovieRepository;
import com.backend.repository.ProfileRepository;
import com.backend.repository.RoleRepository;
import com.backend.repository.UserRepository;
import com.backend.services.MovieService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.net.URL;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DatabaseSeeder {
    @Autowired
    private MovieService movieService;

    @PostConstruct
    public void seedDatabase() {
        try {
            ClassPathResource resource = new ClassPathResource("movies.csv");
            movieService.seedDataFromCsv(resource);
        } catch (Exception e) {
            throw new DataException("Error seeding database: " + e.getMessage());
        }
    }
    @Bean
    CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, MovieRepository movieRepository, ProfileRepository profileRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (roleRepository.findByAuthority("ADMIN").isPresent()) return ;

            Role adminRole = roleRepository.save(new Role("ADMIN"));
            roleRepository.save(new Role("USER"));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            Set<Genre> movieGenres = new HashSet<>();
            movieGenres.add(Genre.ACTION);
            movieGenres.add(Genre.ADVENTURE);
            movieGenres.add(Genre.SCI_FI);

//			Set<Integer> ratings = new HashSet<>();
//			ratings.add(5);

            Movie newMovie = new Movie(11, "Avatar", "none", "en", "test movie", movieGenres, "disney", "12-10-2009", 162);
            Movie movie = movieRepository.save(newMovie);

            Set<Movie> likes = new HashSet<>();
            likes.add(movie);

            Set<Movie> watchLater = new HashSet<>();
            watchLater.add(movie);

            Profile profile = new Profile(1, "demo", "img");
            Profile profiles = profileRepository.save(profile);

            Set<Profile> userProfile = new HashSet<>();
            userProfile.add(profiles);

            User admin = new User(1, passwordEncoder.encode("password"), "demo", "demo", "demo@demo.com", roles, likes, watchLater, userProfile);

            userRepository.save(admin);

        };
    }
}
