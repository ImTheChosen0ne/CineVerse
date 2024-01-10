package com.backend.repository;

import com.backend.models.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository  extends JpaRepository<Rating, Integer> {
}
