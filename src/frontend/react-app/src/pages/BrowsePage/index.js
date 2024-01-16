import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './BrowsePage.css';
import {getMovies} from "../../store/movies";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import Carousel from "../../components/Carousel";
import TopCarousel from "../../components/Carousel/TopCarousel";

function BrowsePage() {
    const dispatch = useDispatch();
    const movies = Object.values(useSelector((state) => state.movies));
    const [loading, setLoading] = useState(true);

    const [videoEnded, setVideoEnded] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    const handleVideoEnd = () => {
        setVideoEnded(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="list-profiles browse-spinner">
                <Spinner loading={loading}/>
            </div>
            {!loading && (
                <div className="browse">
                    <div className="main-browse-container">
                        <div className="main">
                            <div className="main-inner">
                                <video
                                    ref={videoRef}
                                    src={movies[6]?.trailer}
                                    autoPlay
                                    playsInline={true}
                                    muted
                                    onEnded={handleVideoEnd}
                                />
                                {videoEnded && (
                                    <img
                                        src={movies[6]?.media}
                                        alt="Image Overlay"
                                        className="image-overlay"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={movies} title={"Movie Title"}/>
                    </div>
                    <div className="movie-section">
                        <TopCarousel movies={movies} className="carousel"/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={movies} title={"Movie Title"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={movies} title={"Movie Title"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={movies} title={"Movie Title"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={movies} title={"Movie Title"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={movies} title={"Movie Title"}/>
                    </div>
                    <Footer/>
                </div>
            )}
        </div>
    );
}

export default BrowsePage;
