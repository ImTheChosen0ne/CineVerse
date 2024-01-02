import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './BrowsePage.css';
import {getMovies} from "../../store/movies";
import MovieCarousel from "../../components/Carousel";
import Footer from "../../components/Footer";
import TopMovieCarousel from "../../components/Carousel/TopMovieCarousel";

function BrowsePage() {
    const dispatch = useDispatch();
    const movies = Object.values(useSelector((state) => state.movies));

    const [videoEnded, setVideoEnded] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    const handleVideoEnd = () => {
        setVideoEnded(true);
    };

    return (
        <div className="browse">
            <div className="main-browse-container">
                <div className="main">
                    <div className="main-inner">
                        <video
                            ref={videoRef}
                            src={movies[1]?.trailer}
                            autoPlay
                            playsInline={true}
                            muted
                            onEnded={handleVideoEnd}
                        />
                        {videoEnded && (
                            <img
                                src={movies[1]?.poster}
                                alt="Image Overlay"
                                className="image-overlay"
                            />
                        )}
                    </div>
                </div>
            </div>
            {/*<div className="movies">*/}
            <div className="movie-section">
                <h2>Movies Title</h2>
                <MovieCarousel movies={movies} className="carousel"/>
            </div>
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
            {/*</div>*/}
            <Footer/>
        </div>
    );
}

export default BrowsePage;
