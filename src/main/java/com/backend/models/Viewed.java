package com.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name="viewed")
public class Viewed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "viewed_id")
    private Integer viewedId;
    private String date;
    private boolean watched;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    public Viewed() {}
    public Viewed(Integer viewedId, String date, boolean watched, Movie movie) {
        this.viewedId = viewedId;
        this.date = date;
        this.watched = watched;
        this.movie = movie;
    }

    @PostPersist
    @PostUpdate
    private void updateMovieViews() {
        if (watched) {
            movie.setViews(movie.getViews() + 1);
        }
    }

    public Integer getViewedId() {
        return viewedId;
    }

    public void setViewedId(Integer viewedId) {
        this.viewedId = viewedId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public boolean isWatched() {
        return watched;
    }

    public void setWatched(boolean watched) {
        this.watched = watched;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }
}
