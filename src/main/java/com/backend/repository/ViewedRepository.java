package com.backend.repository;

import com.backend.models.Viewed;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViewedRepository extends JpaRepository<Viewed, Integer> {
}
