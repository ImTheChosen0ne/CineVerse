package com.backend.models;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Integer movieId;
    private String title;
    private String poster;
    private String language;
    private String description;
    @ElementCollection(targetClass = Genre.class)
    @Enumerated(EnumType.STRING)
    private Set<Genre> genres;
    private String company;
    private LocalDate releaseDate;
    private Integer runtime;

//    @ManyToMany(fetch=FetchType.EAGER)
//    @JoinTable(
//            name="user_ratings",
//            joinColumns = {@JoinColumn(name="movie_id")},
//            inverseJoinColumns = {@JoinColumn(name="user_id")}
//    )
//
//    private Set<Integer> ratings;

    public Movie() {
//        this.ratings = new HashSet<Integer>();
    }
    public Movie(Integer movieId, String title, String poster, String language, String description, Set<Genre> genres, String company, LocalDate releaseDate, Integer runtime) {
        this.movieId = movieId;
        this.title = title;
        this.poster = poster;
        this.language = language;
        this.description = description;
        this.genres = genres;
        this.company = company;
        this.releaseDate = releaseDate;
        this.runtime = runtime;
//        this.ratings = ratings;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Genre> getGenres() {
        return genres;
    }

    public void setGenres(Set<Genre> genres) {
        this.genres = genres;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public int getRuntime() {
        return runtime;
    }

    public void setRuntime(int runtime) {
        this.runtime = runtime;
    }

    public void setRuntime(Integer runtime) {
        this.runtime = runtime;
    }

//    public Set<Integer> getRatings() {
//        return ratings;
//    }
//
//    public void setRatings(Set<Integer> ratings) {
//        this.ratings = ratings;
//    }
}
