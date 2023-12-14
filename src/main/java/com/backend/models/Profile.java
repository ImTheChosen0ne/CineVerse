package com.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name="profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Integer profileId;
    private String name;
    private String img;

//    @ManyToMany(fetch=FetchType.EAGER)
//    @JoinTable(
//            name="user_ratings",
//            joinColumns = {@JoinColumn(name="movie_id")},
//            inverseJoinColumns = {@JoinColumn(name="user_id")}
//    )
//
//    private Set<Integer> ratings;

    public Profile() {}

    public Profile(Integer profileId, String name, String img) {
        this.profileId = profileId;
        this.name = name;
        this.img = img;

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
}
