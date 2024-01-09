import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './NewAndPopular.css';
import { getMovies } from "../../store/movies";
import MovieCarousel from "../../components/Carousel";
import Footer from "../../components/Footer";
import TopMovieCarousel from "../../components/Carousel/TopMovieCarousel";
import Spinner from "../../components/Spinner";

function NewAndPopular() {
    const dispatch = useDispatch();
    const movies = Object.values(useSelector((state) => state.movies));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        };

        fetchData();
    }, []);

    return (
        <div className="new-container">
            <div className="list-profiles browse-spinner">
                <Spinner loading={loading}/>
            </div>
            {!loading && (
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
            )}
            <Footer/>
        </div>
    );
}

export default NewAndPopular;
