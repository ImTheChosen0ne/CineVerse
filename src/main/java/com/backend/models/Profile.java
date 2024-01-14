package com.backend.models;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Integer profileId;
    private String name;
    private String img;
    private boolean maturity;
    private String gameName;

    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(
            name="profile_movie_watch_later",
            joinColumns = {@JoinColumn(name="profile_id")},
            inverseJoinColumns = {@JoinColumn(name="movie_id")}
    )

    private Set<Movie> watchLaterMovies;

    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(
            name="profile_ratings_join",
            joinColumns = {@JoinColumn(name="profile_id")},
            inverseJoinColumns = {@JoinColumn(name="rating_id")}
    )

    private Set<ProfileRating> profileRatings;

    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(
            name="profile_viewed",
            joinColumns = {@JoinColumn(name="profile_id")},
            inverseJoinColumns = {@JoinColumn(name="viewed_id")}
    )

    private Set<Viewed> viewedMovies;

    public Profile() {
        this.watchLaterMovies = new HashSet<Movie>();
        this.profileRatings = new HashSet<ProfileRating>();
    }

    public Profile(Integer profileId, String name, String img, Set<Movie> watchLaterMovies, Set<ProfileRating> profileRatings, Set<Viewed> viewedMovies, boolean maturity, String gameName) {
        this.profileId = profileId;
        this.name = name;
        this.img = img;
        this.maturity = maturity;
        this.gameName = gameName;
        this.watchLaterMovies = watchLaterMovies;
        this.profileRatings = profileRatings;
        this.viewedMovies = viewedMovies;
    }

    public Integer getProfileId() {
        return profileId;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public boolean getMaturity() {
        return maturity;
    }

    public void setMaturity(boolean maturity) {
        this.maturity = maturity;
    }

    public String getGameName() {
        return gameName;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public Set<ProfileRating> getProfileRatings() {
        return profileRatings;
    }

    public void setProfileRatings(Set<ProfileRating> profileRatings) {
        this.profileRatings = profileRatings;
    }

    public Set<Movie> getWatchLaterMovies() {
        return watchLaterMovies;
    }

    public void setWatchLaterMovies(Set<Movie> watchLaterMovies) {
        this.watchLaterMovies = watchLaterMovies;
    }

    public Set<Viewed> getViewedMovies() {
        return viewedMovies;
    }

    public void setViewedMovies(Set<Viewed> viewedMovies) {
        this.viewedMovies = viewedMovies;
    }
}
