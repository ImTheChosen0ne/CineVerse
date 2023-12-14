package com.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;
//    @Column(unique = true)
//    private String username;
    @JsonIgnore
    private String password;
    @Column(unique = true)
    private String email;
    private String firstName;
    private String lastName;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
            name="user_profiles",
            joinColumns = {@JoinColumn(name="user_id")},
            inverseJoinColumns = {@JoinColumn(name="profile_id")}
    )

    private Set<Profile> profiles;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
            name="user_movie_likes",
            joinColumns = {@JoinColumn(name="user_id")},
            inverseJoinColumns = {@JoinColumn(name="movie_id")}
    )

    private Set<Movie> likedMovies;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
            name="user_movie_watch_later",
            joinColumns = {@JoinColumn(name="user_id")},
            inverseJoinColumns = {@JoinColumn(name="movie_id")}
    )

    private Set<Movie> watchLaterMovies;
    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(
            name="user_role_junction",
            joinColumns = {@JoinColumn(name="user_id")},
            inverseJoinColumns = {@JoinColumn(name="role_id")}
    )

    private Set<Role> authorities;

    public User() {
        this.authorities = new HashSet<Role>();
        this.likedMovies = new HashSet<Movie>();
        this.watchLaterMovies = new HashSet<Movie>();
        this.profiles = new HashSet<Profile>();
    }

    public User(Integer userId, String password, String firstName, String lastName, String email, Set<Role> authorities, Set<Movie> likedMovies, Set<Movie> watchLaterMovies, Set<Profile> profiles) {
        this.userId = userId;
//        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.authorities = authorities;
        this.likedMovies = likedMovies;
        this.watchLaterMovies = watchLaterMovies;
        this.profiles = profiles;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

//    public void setUsername(String username) {
//        this.username = username;
//    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setAuthorities(Set<Role> authorities) {
        this.authorities = authorities;
    }

    public Set<Movie> getLikedMovies() {
        return likedMovies;
    }

    public void setLikedMovies(Set<Movie> likedMovies) {
        this.likedMovies = likedMovies;
    }

    public Set<Movie> getWatchLaterMovies() {
        return watchLaterMovies;
    }

    public void setWatchLaterMovies(Set<Movie> watchLaterMovies) {
        this.watchLaterMovies = watchLaterMovies;
    }

    public Set<Profile> getProfiles() {
        return profiles;
    }

    public void setProfiles(Set<Profile> profiles) {
        this.profiles = profiles;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", likedMovies=" + likedMovies +
                ", watchLaterMovies=" + watchLaterMovies +
                ", authorities=" + authorities +
                '}';
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
