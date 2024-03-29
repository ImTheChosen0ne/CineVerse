package com.backend.models;

import jakarta.persistence.*;
@Entity
@Table(name="movie_ratings")
public class MovieRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_rating_id")
    private Integer ratingId;
    private String rating;
    private String date;
    private Integer profileId;
    public MovieRating() {}
    public MovieRating(Integer ratingId, String rating, String date, Integer profileId) {
        this.ratingId = ratingId;
        this.rating = rating;
        this.date = date;
        this.profileId = profileId;
    }

    public Integer getRatingId() {
        return ratingId;
    }

    public void setRatingId(Integer ratingId) {
        this.ratingId = ratingId;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getProfileId() {
        return profileId;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
    }
}
