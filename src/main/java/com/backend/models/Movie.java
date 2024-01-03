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
    @ElementCollection
    @CsvCustomBindByName(column = "company", converter = StringSetConverter.class)
    private Set<String> company;
    @CsvBindByName(column = "releaseDate")
    private String releaseDate;
    @CsvBindByName(column = "runtime")
    private String runtime;
    @Column(length = 1000)
    @CsvBindByName(column = "trailer")
    private String trailer;
    @ElementCollection
    @CsvCustomBindByName(column = "casts", converter = StringSetConverter.class)
    private Set<String> cast;
    @CsvBindByName(column = "director")
    private String director;
    @ElementCollection
    @CsvCustomBindByName(column = "writer", converter = StringSetConverter.class)
    private Set<String> writer;
    @CsvBindByName(column = "maturity")
    private String maturity;
    @ElementCollection
    @CsvCustomBindByName(column = "keywords", converter = StringSetConverter.class)
    private Set<String> keywords;
    @CsvBindByName(column = "popularity")
    private Double popularity;
    @ElementCollection
    @CsvCustomBindByName(column = "tagline", converter = StringSetConverter.class)
    private Set<String> tagline;
    @CsvBindByName(column = "media")
    private String media;


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

    public Movie(Integer movieId, String title, String poster, String language, String description, Set<Genre> genres, Set<String> company, String releaseDate, String runtime, String trailer, Set<String> cast, String director, Set<String> writer, String maturity, Set<String> keywords, Double popularity, Set<String> tagline, String media) {
        this.movieId = movieId;
        this.title = title;
        this.poster = poster;
        this.language = language;
        this.description = description;
        this.genres = genres;
        this.company = company;
        this.releaseDate = releaseDate;
        this.runtime = runtime;
        this.trailer = trailer;
        this.cast = cast;
        this.director = director;
        this.writer = writer;
        this.maturity = maturity;
        this.keywords = keywords;
        this.popularity = popularity;
        this.tagline = tagline;
        this.media = media;

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

    public Set<String> getCompany() {
        return company;
    }

    public void setCompany(Set<String> company) {
        this.company = company;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getRuntime() {
        return runtime;
    }

    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    public String getTrailer() {
        return trailer;
    }

    public Set<String> getCast() {
        return cast;
    }

    public void setCast(Set<String> cast) {
        this.cast = cast;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public Set<String> getWriter() {
        return writer;
    }

    public void setWriter(Set<String> writer) {
        this.writer = writer;
    }

    public String getMaturity() {
        return maturity;
    }

    public void setMaturity(String maturity) {
        this.maturity = maturity;
    }

    public Set<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(Set<String> keywords) {
        this.keywords = keywords;
    }

    public Double getPopularity() {
        return popularity;
    }

    public void setPopularity(Double popularity) {
        this.popularity = popularity;
    }

    public Set<String> getTagline() {
        return tagline;
    }

    public void setTagline(Set<String> tagline) {
        this.tagline = tagline;
    }

    public String getMedia() {
        return media;
    }

    public void setMedia(String media) {
        this.media = media;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }

    //    public Set<Integer> getRatings() {
//        return ratings;
//    }
//
//    public void setRatings(Set<Integer> ratings) {
//        this.ratings = ratings;
//    }
}
