import React, {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './BrowsePage.css';
import {getMovies} from "../../store/movies";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import Carousel from "../../components/Carousel";
import TopCarousel from "../../components/Carousel/TopCarousel";
import {ProfileContext} from "../../context/Profile";

function BrowsePage() {
    const dispatch = useDispatch();
    const movies = Object.values(useSelector((state) => state.movies));
    const [loading, setLoading] = useState(true);
    const { profile } = useContext(ProfileContext);

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

    const randomViewedMovie = profile?.viewedMovies[Math.floor(Math.random() * profile.viewedMovies.length)];
    const myListMovies = profile?.watchLaterMovies
    const actionAndAdventureMovies = movies?.filter((movie) => movie.genres?.includes("ACTION") || movie.genres?.includes("ADVENTURE"));
    const familyMovies = movies?.filter((movie) => movie.genres?.includes("FAMILY"));
    const comedyMovies = movies?.filter((movie) => movie.genres?.includes("COMEDY"));
    const scifiFantasyMovies = movies?.filter((movie) => movie.genres?.includes("SCIENCE_FICTION") || movie.genres?.includes("FANTASY"));
    const dramaMovies = movies?.filter((movie) => movie.genres?.includes("DRAMA"));
    const trendignMovies = movies?.sort((a, b) => b.views - a.views);

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
                    {myListMovies.length>= 3 && (
                    <div className="movie-section">
                        <Carousel movies={myListMovies} title={"My List"}/>
                    </div>
                    )}
                    <div className="movie-section">
                        <TopCarousel movies={movies} className="carousel"/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={movies} title={"New Releases"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={movies} title={"We Think You'll Love These"}/>
                    </div>
                    {profile?.viewedMovies.length >= 1  && (
                    <div className="movie-section">
                        <Carousel movies={movies} title={`Because you watched ${randomViewedMovie?.movie.title}`}/>
                    </div>
                    )}
                    <div className="movie-section">
                        <Carousel movies={trendignMovies} title={"Trending Now"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={movies} title={`Top Picks for ${profile?.name}`}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={actionAndAdventureMovies} title={"Blockbuster Action & Adventure Movies"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={familyMovies} title={"Kids & Family Movies"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={comedyMovies} title={"Comedy Blockbuster Movies"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={scifiFantasyMovies} title={"Sci-fi, Fantasy, Superhero & more"}/>
                    </div>
                    <div className="movie-section">
                        <Carousel movies={dramaMovies} title={"Emotional Dramas"}/>
                    </div>
                    <Footer/>
                </div>
            )}
        </div>
    );
}

export default BrowsePage;
