package com.backend.models;

public enum Genre {
    ACTION("Action"),
    ADVENTURE("Adventure"),
    SCIENCE_FICTION("Sc-fi"),
    FANTASY("Fantasy"),
    CRIME("Crime"),
    DRAMA("Drama"),
    THRILLER("Thriller"),
    FAMILY("family"),
    ANIMATION("Animation"),
    WESTERN("Western"),
    COMEDY("Comedy"),
    ROMANCE("Romance"),
    MYSTERY("Mystery"),
    HORROR("Horror");

    private final String displayName;

    Genre(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
