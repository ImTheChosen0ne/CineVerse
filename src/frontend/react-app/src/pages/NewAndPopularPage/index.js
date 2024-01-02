import React, { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import './NewAndPopular.css';
import { getMovies } from "../../store/movies";
import MovieCarousel from "../../components/Carousel";
import Footer from "../../components/Footer";
import TopMovieCarousel from "../../components/Carousel/TopMovieCarousel";

function NewAndPopular() {
    const dispatch = useDispatch();
    const movies = Object.values(useSelector((state) => state.movies));

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    return (
        <div className="new-container">
            <div className="new-movies">
                <div className="movie-section">
                    <h2>Top 10 Movies in the U.S. Today</h2>
                    <TopMovieCarousel movies={movies} className="carousel"/>
                </div>
                <div className="movie-section">
                    <h2>Movies Title</h2>
                    <MovieCarousel movies={movies} className="carousel"/>
                </div>
                <div className="movie-section">
                    <h2>Movies Title</h2>
                    <MovieCarousel movies={movies} className="carousel"/>
                </div>
                <div className="movie-section">
                    <h2>Movies Title</h2>
                    <MovieCarousel movies={movies} className="carousel"/>
                </div>
                <div className="movie-section">
                    <h2>Movies Title</h2>
                    <MovieCarousel movies={movies} className="carousel"/>
                </div>
                <div className="movie-section">
                    <h2>Movies Title</h2>
                    <MovieCarousel movies={movies} className="carousel"/>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default NewAndPopular;
