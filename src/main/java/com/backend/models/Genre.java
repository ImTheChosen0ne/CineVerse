package com.backend.models;

public enum Genre {
    ACTION("Action"),
    ADVENTURE("Adventure"),
    SCI_FI("Sc-fi");

    private final String displayName;

    Genre(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
