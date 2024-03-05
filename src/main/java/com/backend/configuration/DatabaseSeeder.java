package com.backend.configuration;

import com.backend.exceptions.DataException;
import com.backend.models.*;
import com.backend.repository.*;
import com.backend.services.MovieService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

@Configuration
public class DatabaseSeeder {
    @Autowired
    private MovieService movieService;
    private final ProfileRepository profileRepository;
    private final ProfileRatingRepository profileRatingRepository;
    private final MovieRepository movieRepository;
    private final MovieRatingRepository movieRatingRepository;

    public DatabaseSeeder(ProfileRepository profileRepository, ProfileRatingRepository profileRatingRepository, MovieRepository movieRepository, MovieRatingRepository movieRatingRepository) {
        this.profileRepository = profileRepository;
        this.profileRatingRepository = profileRatingRepository;
        this.movieRepository = movieRepository;
        this.movieRatingRepository = movieRatingRepository;
    }

    @PostConstruct
    public void seedDatabase() {
        try {
            ClassPathResource resource = new ClassPathResource("movies.csv");
            List<Movie> existingMovies = movieRepository.findAll();

            if (existingMovies.isEmpty()) {
                movieService.seedDataFromCsv(resource);
            } else {
                System.out.println("Movies already exist in the database. Skipping CSV data seeding.");
            }
        } catch (Exception e) {
            throw new DataException("Error seeding database: " + e.getMessage());
        }
    }

    @Bean
    CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, MovieRepository movieRepository, ProfileRepository profileRepository, ViewedRepository viewedRepository, MovieRatingRepository movieRatingRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (roleRepository.findByAuthority("ADMIN").isPresent()) return;

            Role adminRole = roleRepository.save(new Role("ADMIN"));
            roleRepository.save(new Role("USER"));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            Set<Movie> watchLater = new HashSet<>();
            watchLater.add(movieRepository.findById(3).get());
            watchLater.add(movieRepository.findById(15).get());
            watchLater.add(movieRepository.findById(51).get());
            watchLater.add(movieRepository.findById(76).get());

            Set<ProfileRating> movieProfileProfileRatings = new HashSet<>();

            Set<Viewed> viewedMovies = new HashSet<>();
            Viewed viewed = new Viewed(null, "1/20/2024", true, movieRepository.findById(31).get());
            Viewed viewed2 = new Viewed(null, "11/17/2023", true, movieRepository.findById(74).get());
            Viewed viewed3 = new Viewed(null, "2/10/2024", true, movieRepository.findById(62).get());
            Viewed viewed4 = new Viewed(null, "9/24/2023", true, movieRepository.findById(12).get());

            viewedMovies.add(viewed);
            viewedMovies.add(viewed2);
            viewedMovies.add(viewed3);
            viewedMovies.add(viewed4);

            viewedRepository.saveAll(viewedMovies);

            Profile profile = new Profile(1, "Demo", "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABfjwXqIYd3kCEU6KWsiHSHvkft8VhZg0yyD50a_pHXku4dz9VgxWwfA2ontwogStpj1NE9NJMt7sCpSKFEY2zmgqqQfcw1FMWwB9.png?r=229", watchLater, movieProfileProfileRatings, viewedMovies , true, "demo game");
            Profile profiles = profileRepository.save(profile);

            Profile profile2 = new Profile(2, "Demo2", "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABfjwXqIYd3kCEU6KWsiHSHvkft8VhZg0yyD50a_pHXku4dz9VgxWwfA2ontwogStpj1NE9NJMt7sCpSKFEY2zmgqqQfcw1FMWwB9.png?r=229", watchLater, movieProfileProfileRatings, viewedMovies, true, "demo game2");
            Profile profiles2 = profileRepository.save(profile2);

            Profile profileKid = new Profile(3, "Kid", "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABfjwXqIYd3kCEU6KWsiHSHvkft8VhZg0yyD50a_pHXku4dz9VgxWwfA2ontwogStpj1NE9NJMt7sCpSKFEY2zmgqqQfcw1FMWwB9.png?r=229", watchLater, movieProfileProfileRatings, viewedMovies, false, "Kid");
            Profile profilesKid = profileRepository.save(profileKid);

            Set<Profile> userProfile = new HashSet<>();
            userProfile.add(profiles);
            userProfile.add(profiles2);
            userProfile.add(profilesKid);

            User admin = new User(1, passwordEncoder.encode("password"), "demo", "demo", "demo@demo.com", roles, userProfile, "premium");

            userRepository.save(admin);

            seedProfileRatings();
        };
    }

    private void processProfileRating(String ratingData) {
        String[] parts = ratingData.split(",");

        if (parts.length == 5) {
            Integer ratingId = Integer.parseInt(parts[0]);
            String date = parts[1];
            Integer movieId = Integer.parseInt(parts[2]);
            String ratingValue = parts[3];
            Integer profileId = Integer.parseInt(parts[4]);

            Profile profile = profileRepository.findById(profileId).orElse(null);
            Movie movie = movieRepository.findById(movieId).orElse(null);
            if (profile != null) {
                ProfileRating profileRating = new ProfileRating();
                profileRating.setRatingId(ratingId);
                profileRating.setDate(date);
                profileRating.setRating(ratingValue);

                if (movie != null) {
                    profileRating.setMovie(movie);
                } else {
                    System.out.println("Movie not found for ID: " + movieId);
                }

                profileRatingRepository.save(profileRating);

                profile.getProfileRatings().add(profileRating);
                profileRepository.save(profile);
            } else {
                System.out.println("Profile not found for ID: " + profileId);
            }

            MovieRating movieRating = new MovieRating();
            if (movie != null) {
                movieRating.setRatingId(ratingId);
                movieRating.setDate(date);
                movieRating.setProfileId(profileId);
                movieRating.setRating(ratingValue);

                movie.getRatings().add(movieRating);

                movieRatingRepository.save(movieRating);
                movieRepository.save(movie);
            } else {
                System.out.println("Movie not found for ID: " + movieId);
            }
        } else {
            System.out.println("Invalid profile rating data: " + ratingData);
        }


    }

    private void seedProfileRatings() {
        String[] profileRatingsData = {
                "1,2/16/2023,1,superlike,2",
                "2,10/2/2023,1,dislike,1",
                "3,7/20/2023,2,like,2",
                "4,8/30/2023,2,superlike,1",
                "5,4/14/2023,3,like,1",
                "6,9/25/2023,3,dislike,2",
                "7,3/10/2023,4,like,2",
                "8,6/18/2023,4,superlike,1",
                "9,10/15/2023,5,like,1",
                "10,11/25/2023,5,dislike,2",
                "11,6/22/2023,6,superlike,2",
                "12,4/4/2023,6,dislike,1",
                "13,12/12/2023,7,like,1",
                "14,1/30/2023,7,dislike,2",
                "15,5/19/2023,8,superlike,2",
                "16,7/7/2023,8,like,1",
                "17,6/14/2023,9,superlike,1",
                "18,4/22/2023,9,like,2",
                "19,12/1/2023,10,like,2",
                "20,10/20/2023,10,superlike,1",
                "32,7/25/2023,11,like,1",
                "33,5/9/2023,11,superlike,2",
                "35,1/12/2023,12,like,2",
                "36,11/28/2023,12,dislike,1",
                "38,6/18/2023,13,dislike,2",
                "39,3/27/2023,13,superlike,1",
                "41,10/3/2023,14,dislike,1",
                "42,8/25/2023,14,like,2",
                "44,2/22/2023,15,dislike,2",
                "45,11/11/2023,15,superlike,1",
                "47,4/3/2023,16,dislike,1",
                "48,1/1/2023,16,like,2",
                "50,5/15/2023,17,dislike,2",
                "51,12/25/2023,17,superlike,1",
                "53,7/10/2023,18,dislike,1",
                "54,3/30/2023,18,like,2",
                "56,4/8/2023,19,dislike,2",
                "57,1/18/2023,19,superlike,1",
                "59,6/1/2023,20,dislike,1",
                "60,2/12/2023,20,like,2",
                "62,9/9/2023,21,dislike,2",
                "63,12/12/2023,21,superlike,1",
                "65,3/3/2023,22,dislike,1",
                "66,8/8/2023,22,like,2",
                "68,10/10/2023,23,dislike,2",
                "69,1/1/2023,23,superlike,1",
                "71,7/7/2023,24,dislike,1",
                "72,2/2/2023,24,like,2",
                "74,4/4/2023,25,dislike,2",
                "75,12/12/2023,25,superlike,1",
                "77,3/3/2023,26,dislike,1",
                "78,8/8/2023,26,like,2",
                "80,10/10/2023,27,dislike,2",
                "81,1/1/2023,27,superlike,1",
                "83,7/7/2023,28,dislike,1",
                "84,2/2/2023,28,like,2",
                "86,4/4/2023,29,dislike,2",
                "87,12/12/2023,29,superlike,1",
                "89,3/3/2023,30,dislike,1",
                "90,8/8/2023,30,like,2",
                "92,10/10/2023,31,dislike,2",
                "93,1/1/2023,31,superlike,1",
                "95,7/7/2023,32,dislike,1",
                "96,2/2/2023,32,like,2",
                "98,4/4/2023,33,dislike,2",
                "99,12/12/2023,33,superlike,1",
                "101,3/3/2023,34,dislike,1",
                "102,8/8/2023,34,like,2",
                "104,10/10/2023,35,dislike,2",
                "105,1/1/2023,35,superlike,1",
                "107,7/7/2023,36,dislike,1",
                "108,2/2/2023,36,like,2",
                "110,4/4/2023,37,dislike,2",
                "111,12/12/2023,37,superlike,1",
                "113,3/3/2023,38,dislike,1",
                "114,8/8/2023,38,like,2",
                "116,10/10/2023,39,dislike,2",
                "117,1/1/2023,39,superlike,1",
                "119,7/7/2023,40,dislike,1",
                "120,2/2/2023,40,like,2",
                "122,4/4/2023,41,dislike,2",
                "123,12/12/2023,41,superlike,1",
                "125,3/3/2023,42,dislike,1",
                "126,8/8/2023,42,like,2",
                "128,10/10/2023,43,dislike,2",
                "129,1/1/2023,43,superlike,1",
                "131,7/7/2023,44,dislike,1",
                "132,2/2/2023,44,like,2",
                "134,4/4/2023,45,dislike,2",
                "135,12/12/2023,45,superlike,1",
                "137,3/3/2023,46,dislike,1",
                "138,8/8/2023,46,like,2",
                "140,10/10/2023,47,dislike,2",
                "141,1/1/2023,47,superlike,1",
                "143,7/7/2023,48,dislike,1",
                "144,2/2/2023,48,like,2",
                "146,4/4/2023,49,dislike,2",
                "147,12/12/2023,49,superlike,1",
                "149,3/3/2023,50,dislike,1",
                "150,8/8/2023,50,like,2",
//                "152,10/10/2023,51,dislike,2",
//                "153,1/1/2023,51,superlike,1",
//                "155,7/7/2023,52,dislike,1",
//                "156,2/2/2023,52,like,2",
//                "158,4/4/2023,53,dislike,2",
//                "159,12/12/2023,53,superlike,1",
//                "161,3/3/2023,54,dislike,1",
//                "162,8/8/2023,54,like,2",
//                "164,10/10/2023,55,dislike,2",
//                "165,1/1/2023,55,superlike,1",
//                "167,7/7/2023,56,dislike,1",
//                "168,2/2/2023,56,like,2",
//                "170,4/4/2023,57,dislike,2",
//                "171,12/12/2023,57,superlike,1",
//                "173,3/3/2023,58,dislike,1",
//                "174,8/8/2023,58,like,2",
//                "176,10/10/2023,59,dislike,2",
//                "177,1/1/2023,59,superlike,1",
//                "179,7/7/2023,60,dislike,1",
//                "180,2/2/2023,60,like,2",
//                "182,4/4/2023,61,dislike,2",
//                "183,12/12/2023,61,superlike,1",
//                "185,3/3/2023,62,dislike,1",
//                "186,8/8/2023,62,like,2",
//                "188,10/10/2023,63,dislike,2",
//                "189,1/1/2023,63,superlike,1",
//                "191,7/7/2023,64,dislike,1",
//                "192,2/2/2023,64,like,2",
//                "194,4/4/2023,65,dislike,2",
//                "195,12/12/2023,65,superlike,1",
//                "197,3/3/2023,66,dislike,1",
//                "198,8/8/2023,66,like,2",
//                "200,10/10/2023,67,dislike,2",
//                "201,1/1/2023,67,superlike,1",
//                "203,7/7/2023,68,dislike,1",
//                "204,2/2/2023,68,like,2",
//                "206,4/4/2023,69,dislike,2",
//                "207,12/12/2023,69,superlike,1",
//                "209,3/3/2023,70,dislike,1",
//                "210,8/8/2023,70,like,2",
//                "212,10/10/2023,71,dislike,2",
//                "213,1/1/2023,71,superlike,1",
//                "215,7/7/2023,72,dislike,1",
//                "216,2/2/2023,72,like,2",
//                "218,4/4/2023,73,dislike,2",
//                "219,12/12/2023,73,superlike,1",
//                "221,3/3/2023,74,dislike,1",
//                "222,8/8/2023,74,like,2",
//                "224,10/10/2023,75,dislike,2",
//                "225,1/1/2023,75,superlike,1",
//                "227,7/7/2023,76,dislike,1",
//                "228,2/2/2023,76,like,2",
//                "230,4/4/2023,77,dislike,2",
//                "231,12/12/2023,77,superlike,1",
//                "233,3/3/2023,78,dislike,1",
//                "234,8/8/2023,78,like,2",
//                "236,10/10/2023,79,dislike,2",
//                "237,1/1/2023,79,superlike,1",
//                "239,7/7/2023,80,dislike,1",
//                "240,2/2/2023,80,like,2",
//                "242,4/4/2023,81,dislike,2",
//                "243,12/12/2023,81,superlike,1",
//                "245,3/3/2023,82,dislike,1",
//                "246,8/8/2023,82,like,2",
//                "248,10/10/2023,83,dislike,2",
//                "249,1/1/2023,83,superlike,1",
//                "251,7/7/2023,84,dislike,1",
//                "252,2/2/2023,84,like,2",
//                "254,4/4/2023,85,dislike,2",
//                "255,12/12/2023,85,superlike,1",
//                "257,3/3/2023,86,dislike,1",
//                "258,8/8/2023,86,like,2",
//                "260,10/10/2023,87,dislike,2",
//                "261,1/1/2023,87,superlike,1",
//                "263,7/7/2023,88,dislike,1",
//                "264,2/2/2023,88,like,2",
//                "266,4/4/2023,89,dislike,2",
//                "267,12/12/2023,89,superlike,1",
//                "269,3/3/2023,90,dislike,1",
//                "270,8/8/2023,90,like,2",
//                "272,10/10/2023,91,dislike,2",
//                "273,1/1/2023,91,superlike,1",
//                "275,7/7/2023,92,dislike,1",
//                "276,2/2/2023,92,like,2",
//                "278,4/4/2023,93,dislike,2",
//                "279,12/12/2023,93,superlike,1",
//                "281,3/3/2023,94,dislike,1",
//                "282,8/8/2023,94,like,2",
//                "284,10/10/2023,95,dislike,2",
//                "285,1/1/2023,95,superlike,1",
//                "287,7/7/2023,96,dislike,1",
//                "288,2/2/2023,96,like,2",
//                "290,4/4/2023,97,dislike,2",
//                "291,12/12/2023,97,superlike,1",
//                "293,3/3/2023,98,dislike,1",
//                "294,8/8/2023,98,like,2",
//                "296,10/10/2023,99,dislike,2",
//                "297,1/1/2023,99,superlike,1",
//                "299,7/7/2023,100,dislike,1",
//                "300,2/2/2023,100,like,2"
        };

        for (String ratingData : profileRatingsData) {
            processProfileRating(ratingData);
        }

    }
}
