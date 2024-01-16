package com.backend.services;
import com.backend.models.*;
import com.backend.repository.MovieRatingRepository;
import com.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.backend.repository.MovieRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;

@Service
public class MovieService {
    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final MovieRatingRepository movieRatingRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository, UserRepository userRepository, MovieRatingRepository movieRatingRepository) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.movieRatingRepository = movieRatingRepository;
    }

    public List<Movie> findAllMovies() {
        return movieRepository.findAll();
    }

    public MovieRating movieRating(String email, Integer movieId, MovieRating movieRating) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
                Movie movie = movieRepository.findById(movieId).orElse(null);

                if (movie != null) {
                    movie.getRatings().add(movieRating);
                    MovieRating savedMovieRating = movieRatingRepository.save(movieRating);

                    movieRepository.save(movie);
                    return savedMovieRating;
                }
            }
        return null;
    }

    public MovieRating updateMovieRating(String email, Integer profileId, Integer ratingId, Integer movieId, MovieRating updatedMovieRating) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
                    Movie movie = movieRepository.findById(movieId).orElse(null);

                    Optional<MovieRating> optionalMovieRating = movie.getRatings().stream()
                            .filter(rating -> rating.getProfileId().equals(profileId) && rating.getRatingId().equals(ratingId))
                            .findFirst();

                    if (optionalMovieRating.isPresent()) {
                        MovieRating existingMovieRating = optionalMovieRating.get();

                        existingMovieRating.setRating(updatedMovieRating.getRating());
                        existingMovieRating.setDate(updatedMovieRating.getDate());

                        MovieRating updateRating = movieRatingRepository.save(existingMovieRating);
                        movieRepository.save(movie);
                        return updateRating;
                    }
                }
        return null;
    }

    public Optional<Movie> findMovieById(Integer id) {
        return movieRepository.findById(id);
    }

    public void seedDataFromCsv(Resource resource) throws Exception {
        try (Reader reader = new InputStreamReader(resource.getInputStream())) {
            CsvToBean<Movie> csvToBean = new CsvToBeanBuilder<Movie>(reader)
                    .withType(Movie.class)
                    .withSeparator(';')
                    .withQuoteChar('"')
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();
            List<Movie> entities = csvToBean.parse();

            // Log the parsed entities
            for (Movie entity : entities) {
                logger.info("Parsed movie: {}", entity);
            }

            //movieRepository.deleteAll();
            movieRepository.saveAll(entities);

            logger.info("Seed data from CSV completed successfully.");
        } catch (Exception e) {
            logger.error("Error seeding data from CSV: {}", e.getMessage(), e);
            throw e;
        }
    }
}


