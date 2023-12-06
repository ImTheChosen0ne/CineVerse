package com.backend;

import com.backend.models.Movie;
import com.backend.models.User;
import com.backend.models.Role;
import com.backend.repository.MovieRepository;
import com.backend.repository.RoleRepository;
import com.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, MovieRepository movieRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (roleRepository.findByAuthority("ADMIN").isPresent()) return ;

			Role adminRole = roleRepository.save(new Role("ADMIN"));
			roleRepository.save(new Role("USER"));

			Set<Role> roles = new HashSet<>();
			roles.add(adminRole);

			Set<String> movieGenres = new HashSet<>();
			movieGenres.add("Action");
			movieGenres.add("Adventure");
			movieGenres.add("Sci-Fi");

//			Set<Integer> ratings = new HashSet<>();
//			ratings.add(5);

			Movie newMovie = new Movie(1, "Avatar", "none", "en", "test movie", movieGenres, "disney", LocalDate.of(2009,10,12), 162);
			Movie movie = movieRepository.save(newMovie);

			Set<Movie> likes = new HashSet<>();
			likes.add(movie);

			Set<Movie> watchLater = new HashSet<>();
			watchLater.add(movie);

			User admin = new User(1, "admin", passwordEncoder.encode("password"), "demo", "demo", "demo@demo.com", roles, likes, watchLater);

			userRepository.save(admin);

		};
	}
}
