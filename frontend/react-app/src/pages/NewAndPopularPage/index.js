import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './NewAndPopular.css';
import { getMovies } from "../../store/movies";
import Carousel from "../../components/Carousel";
import Footer from "../../components/Footer";
import TopCarousel from "../../components/Carousel/TopCarousel";
import Spinner from "../../components/Spinner";

function NewAndPopular() {
    const dispatch = useDispatch();
    const movies = Object.values(useSelector((state) => state.movies.movies));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getMovies())
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setLoading(false);
            });
    }, [dispatch]);

    const moviesCopy = [...movies];
    const trendingMovies = moviesCopy?.slice().sort((a, b) => b.views - a.views);
    const popular = moviesCopy?.slice().sort((a, b) => b.popularity - a.popularity);

    const newReleases = moviesCopy?.slice().sort((a, b) => {
        const dateA = new Date(a.dateadded);
        const dateB = new Date(b.dateadded);
        return dateB - dateA;
    });

    const worthWait = moviesCopy?.slice().sort((a, b) => {
        const dateA = new Date(a.dateadded);
        const dateB = new Date(b.dateadded);
        return dateB - dateA;
    }).sort(() => Math.random() - 0.5);

    const ratingValues = {
        "dislike": 1,
        "like": 3,
        "superlike": 5
    };

    const topMovies = moviesCopy.sort((a, b) => {
        const avgRatingA = calculateAverageRating(a.ratings);
        const avgRatingB = calculateAverageRating(b.ratings);

        return avgRatingB - avgRatingA;
    });

    function calculateAverageRating(ratings) {
        const total = ratings.reduce((sum, rating) => {
            return sum + ratingValues[rating.rating];
        }, 0);

        return total / ratings.length;
    }

    return (
        <div className="new-container">
            <div className={`browse-spinner ${loading}`}>
                <Spinner loading={loading}/>
            </div>
            {!loading && (
                <div className="new-movies">
                    <div className="movie-section">
                        <TopCarousel movies={topMovies}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={newReleases} title={"New on CineVerse"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={worthWait} title={"Worth the wait"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={popular} title={"Popular on CineVerse"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={trendingMovies} title={"Trending Now"}/>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
}

export default NewAndPopular;
