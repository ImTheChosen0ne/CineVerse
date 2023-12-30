package com.backend.configuration;

import com.backend.exceptions.DataException;
import com.backend.models.*;
import com.backend.repository.MovieRepository;
import com.backend.repository.ProfileRepository;
import com.backend.repository.RoleRepository;
import com.backend.repository.UserRepository;
import com.backend.services.MovieService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DatabaseSeeder {
    @Autowired
    private MovieService movieService;

    @PostConstruct
    public void seedDatabase() {
        try {
            ClassPathResource resource = new ClassPathResource("movies.csv");
            movieService.seedDataFromCsv(resource);
        } catch (Exception e) {
            throw new DataException("Error seeding database: " + e.getMessage());
        }
    }
    @Bean
    CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, MovieRepository movieRepository, ProfileRepository profileRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (roleRepository.findByAuthority("ADMIN").isPresent()) return ;

            Role adminRole = roleRepository.save(new Role("ADMIN"));
            roleRepository.save(new Role("USER"));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            Set<Genre> movieGenres = new HashSet<>();
            movieGenres.add(Genre.ACTION);
            movieGenres.add(Genre.ADVENTURE);
            movieGenres.add(Genre.SCI_FI);

//			Set<Integer> ratings = new HashSet<>();
//			ratings.add(5);

            Movie newMovie = new Movie(112, "Avatar", "https://lumiere-a.akamaihd.net/v1/images/avatar_coverart_1600x686_36ea5484.jpeg?region=0,0,1600,686", "en", "test movie", movieGenres, "disney", "12-10-2009", 162, "https://imdb-video.media-imdb.com/vi531039513/1434659607842-pgv4ql-1440787227613.mp4?Expires=1703099369&Signature=aq2qhuTxJSoc4Jo2OFd9Vk51LBA9K7AXT~ROqwF9~WRTCx319kVzeZ~OTsP9rxniaqt4CwF6SuEdms97-3ASq3WX173jvO6Wk-5j7kAEg7VAeNwRqzOtBNErjBRU1h6yt2Wbp0P2NUXP9yVoA9waY5GjdEpMWPBD5~z-9b7XkHYaXMmSAmtFxKHrK0tNsMPROHWJXlY1qAMTMYXlJykEipAKwzS2lwD9rPUujI0ctbS9txOr1boqQJrMId34aAHsXX0~akbLO-oeGAgAh6owC0hav8tlzejR-Vh7dHOC~UeUEu4zi8sZEkxNJBbZfvIzsEByLM2c6ObAH-IM3LmLTg__&Key-Pair-Id=APKAIFLZBVQZ24NQH3KA");
            Movie movie = movieRepository.save(newMovie);

            Set<Movie> likes = new HashSet<>();
            likes.add(movie);

            Set<Movie> watchLater = new HashSet<>();
            watchLater.add(movie);

            Profile profile = new Profile(1, "demo", "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABbGa4GvjA3sdbhrXZi7RG0-nuSXUxt-IZoVxB_7lHtMKT-wQ-CsDeukenQ6z6x4iUdqx4NJR4Sr3RDraWK1uYyKWRapH8T-tnFtb.png?r=59d");
            Profile profiles = profileRepository.save(profile);

            Profile profile2 = new Profile(2, "demo2", "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABbGa4GvjA3sdbhrXZi7RG0-nuSXUxt-IZoVxB_7lHtMKT-wQ-CsDeukenQ6z6x4iUdqx4NJR4Sr3RDraWK1uYyKWRapH8T-tnFtb.png?r=59d");
            Profile profiles2 = profileRepository.save(profile2);

            Set<Profile> userProfile = new HashSet<>();
            userProfile.add(profiles);
            userProfile.add(profiles2);

            User admin = new User(1, passwordEncoder.encode("password"), "demo", "demo", "demo@demo.com", roles, likes, watchLater, userProfile);

            userRepository.save(admin);

        };
    }
}
