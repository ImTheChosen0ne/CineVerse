package com.backend.services;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.backend.models.Movie;
import com.backend.repository.MovieRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.Reader;
import java.util.*;

@Service
public class MovieService {
    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);
    private final MovieRepository movieRepository;
    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> findAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> findMovieById(Integer id) {
        return movieRepository.findById(id);
    }

    public void seedDataFromCsv(String filePath) throws Exception {
        try (Reader reader = new FileReader(filePath)) {
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

//            movieRepository.deleteAll();
            movieRepository.saveAll(entities);

            logger.info("Seed data from CSV completed successfully.");
        } catch (Exception e) {
            logger.error("Error seeding data from CSV: {}", e.getMessage(), e);
            throw e;  // rethrow the exception if needed
        }
    }
}


