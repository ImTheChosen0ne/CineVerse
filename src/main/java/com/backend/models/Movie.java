package com.backend.models;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvCustomBindByName;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @CsvBindByName(column = "movieId")
    @Column(name = "movieid")
    private Integer movieid;
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
    @Enumerated(EnumType.STRING)
    @CsvCustomBindByName(column = "genres", converter = GenreSetConverter.class)
    private Set<Genre> genres;
    @ElementCollection
    @CsvCustomBindByName(column = "companies", converter = StringSetConverter.class)
    private Set<String> companies;
    @Column(name = "releasedate")
    @CsvBindByName(column = "releasedate")
    private String releasedate;
    @CsvBindByName(column = "runtime")
    private String runtime;
    @Column(length = 1000)
    @CsvBindByName(column = "trailer")
    private String trailer;
    @ElementCollection
    @CsvCustomBindByName(column = "casts", converter = StringSetConverter.class)
    private Set<String> casts;
    @CsvBindByName(column = "director")
    private String director;
    @ElementCollection
    @CsvCustomBindByName(column = "writers", converter = StringSetConverter.class)
    private Set<String> writers;
    @CsvBindByName(column = "maturity")
    private String maturity;
    @ElementCollection
    @CsvCustomBindByName(column = "keywords", converter = StringSetConverter.class)
    private Set<String> keywords;
    @CsvBindByName(column = "popularity")
    private Double popularity;
    @CsvBindByName(column = "tagline")
    private String tagline;
    @CsvBindByName(column = "backdrop")
    private String backdrop;
    @Column(name = "titleimage")
    @CsvBindByName(column = "titleimage")
    private String titleimage;
    @Column(name = "dateadded")
    @CsvBindByName(column = "dateadded")
    private String dateadded;
    @CsvBindByName(column = "views")
    private Integer views = 0;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "movie_ratings_join",
            joinColumns = {@JoinColumn(name = "movieid")},
            inverseJoinColumns = {@JoinColumn(name = "movie_rating_id")}
    )

    private Set<MovieRating> ratings;

    public Movie() {
        this.ratings = new HashSet<MovieRating>();
    }
    public Movie(Integer movieid, String title, String poster, String language, String description, Set<Genre> genres, Set<String> companies, String releasedate, String runtime, String trailer, Set<String> casts, String director, Set<String> writers, String maturity, Set<String> keywords, Double popularity, String tagline, String backdrop, Set<MovieRating> ratings, String titleimage, String dateadded, Integer views) {
        this.movieid = movieid;
        this.title = title;
        this.poster = poster;
        this.language = language;
        this.description = description;
        this.genres = genres;
        this.companies = companies;
        this.releasedate = releasedate;
        this.runtime = runtime;
        this.trailer = trailer;
        this.casts = casts;
        this.director = director;
        this.writers = writers;
        this.maturity = maturity;
        this.keywords = keywords;
        this.popularity = popularity;
        this.tagline = tagline;
        this.backdrop = backdrop;
        this.ratings = ratings;
        this.titleimage = titleimage;
        this.dateadded = dateadded;
        this.views = views;
    }

    public Integer getMovieid() {
        return movieid;
    }

    public void setMovieid(Integer movieid) {
        this.movieid = movieid;
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

    public Set<String> getCompanies() {
        return companies;
    }

    public void setCompanies(Set<String> companies) {
        this.companies = companies;
    }

    public String getReleasedate() {
        return releasedate;
    }

    public void setReleasedate(String releasedate) {
        this.releasedate = releasedate;
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

    public Set<String> getCasts() {
        return casts;
    }

    public void setCasts(Set<String> casts) {
        this.casts = casts;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public Set<String> getWriters() {
        return writers;
    }

    public void setWriters(Set<String> writers) {
        this.writers = writers;
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

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getBackdrop() {
        return backdrop;
    }

    public void setBackdrop(String backdrop) {
        this.backdrop = backdrop;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }

    public Set<MovieRating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<MovieRating> ratings) {
        this.ratings = ratings;
    }

    public String getTitleimage() {return titleimage;}

    public void setTitleimage(String titleimage) {this.titleimage = titleimage;}

    public String getDateadded() {return dateadded;}

    public void setDateadded(String dateadded) {this.dateadded = dateadded;}

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }
}
