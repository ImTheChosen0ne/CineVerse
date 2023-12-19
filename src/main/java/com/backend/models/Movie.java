package com.backend.models;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvCustomBindByName;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name="movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @CsvBindByName(column = "movieId")
    @Column(name = "movie_id")
    private Integer movieId;
    @CsvBindByName(column = "title")
    private String title;
    @CsvBindByName(column = "poster")
    private String poster;
    @CsvBindByName(column = "language")
    private String language;
    @Column(length = 1000)
    @CsvBindByName(column = "description")
    private String description;
    @ElementCollection
    @CsvCustomBindByName(column = "genres", converter = GenreSetConverter.class)
    private Set<Genre> genres;
    @CsvBindByName(column = "company")
    private String company;
    @CsvBindByName(column = "releaseDate")
    private String releaseDate;
    @CsvBindByName(column = "runtime")
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

    public Movie(Integer movieId, String title, String poster, String language, String description, Set<Genre> genres, String company, String releaseDate, Integer runtime) {
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

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Integer getRuntime() {
        return runtime;
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
