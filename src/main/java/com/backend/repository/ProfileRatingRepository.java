package com.backend.repository;

import com.backend.models.ProfileRating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRatingRepository extends JpaRepository<ProfileRating, Integer> {
}
