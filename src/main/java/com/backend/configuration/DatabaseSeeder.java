package com.backend.configuration;

import com.backend.exceptions.DataException;
import com.backend.services.MovieService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.File;

@Configuration
public class DatabaseSeeder {
    @Autowired
    private MovieService movieService;

    @PostConstruct
    public void seedDatabase() {
        try {
            File file = new ClassPathResource("movies.csv").getFile();
            movieService.seedDataFromCsv(file.getAbsolutePath());
        } catch (Exception e) {
            throw new DataException("Error seeding database: " + e.getMessage());
        }
    }

}
