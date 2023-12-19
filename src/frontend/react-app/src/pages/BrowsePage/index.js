import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './BrowsePage.css';
import {getMovies} from "../../store/movies";
import MovieCarousel from "../../components/Carousel";

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
        <div>
            <div className="main-browse-container">
                <div className="main">
                    <div className="main-inner">
                        <video
                            ref={videoRef}
                            src={movies[0]?.trailer}
                            autoPlay
                            playsInline={true}
                            controls
                            muted
                            onEnded={handleVideoEnd}
                        />
                        {videoEnded && (
                            <img
                                src={movies[0]?.poster}
                                alt="Image Overlay"
                                className="image-overlay"
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="movie-section">
                <MovieCarousel movies={movies} className="carousel"/>
            </div>
        </div>
    );
}

export default BrowsePage;
