package com.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name="ratings")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="rating_id")
    private Integer ratingId;
    private String rating;
    private String date;

    @ManyToOne
    @JoinColumn(name="movie_id")
    private Movie movie;

    public Rating(Integer ratingId, String rating, String date, Movie movie) {
        this.ratingId = ratingId;
        this.rating = rating;
        this.date = date;
        this.movie = movie;
    }

    public Rating() {}

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

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }
}
