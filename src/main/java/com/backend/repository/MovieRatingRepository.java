package com.backend.repository;

import com.backend.models.MovieRating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRatingRepository  extends JpaRepository<MovieRating, Integer> {
}
