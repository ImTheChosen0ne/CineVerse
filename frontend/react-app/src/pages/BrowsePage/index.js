import React, {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './BrowsePage.css';
import {getMovies} from "../../store/movies";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import Carousel from "../../components/Carousel";
import TopCarousel from "../../components/Carousel/TopCarousel";
import {ProfileContext} from "../../context/Profile";
import {NavLink} from "react-router-dom";
import OpenModalButton from "../../components/OpenModalButton";
import MoreMovieInfo from "../../components/MoreMovieInfoModal";

function BrowsePage() {
    const dispatch = useDispatch();
    const movies = Object.values(useSelector((state) => state.movies));
    const [loading, setLoading] = useState(true);
    const { profile } = useContext(ProfileContext);
    const sessionUser = useSelector(state => state.session.user);
    const updatedProfile = sessionUser?.profiles.find(profiles => profiles?.profileId === profile?.profileId)


    const [videoEnded, setVideoEnded] = useState(false);
    const videoRef = useRef(null);

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

    const handleVideoEnd = () => {
        setVideoEnded(true);
    };

    const moviesCopy = [...movies];

    let randomViewedMovie;
    if (profile && profile.viewedMovies && profile.viewedMovies.length > 0) {
        randomViewedMovie = profile.viewedMovies[Math.floor(Math.random() * profile.viewedMovies.length)];
    }

    // const randomViewedMovie = profile?.viewedMovies[Math.floor(Math.random() * profile?.viewedMovies.length)];
    // const randomMovie = movies[Math.floor(Math.random() * movies.length)];

    const [randomMovie, setRandomMovie] = useState(null);

    useEffect(() => {
        if (!randomMovie) {
            const newRandomMovie = movies[Math.floor(Math.random() * movies.length)];
            setRandomMovie(newRandomMovie);
        }
    }, [movies, randomMovie]);


    const myListMovies = updatedProfile?.watchLaterMovies
    const actionAndAdventureMovies = movies?.filter((movie) => movie.genres?.includes("ACTION") || movie.genres?.includes("ADVENTURE")).sort((a, b) => b.views - a.views);
    const familyMovies = movies?.filter((movie) => movie.genres?.includes("FAMILY")).sort((a, b) => b.views - a.views);
    const comedyMovies = movies?.filter((movie) => movie.genres?.includes("COMEDY")).sort((a, b) => b.views - a.views);
    const scifiFantasyMovies = movies?.filter((movie) => movie.genres?.includes("SCIENCE_FICTION") || movie.genres?.includes("FANTASY")).sort((a, b) => b.views - a.views);
    const dramaMovies = movies?.filter((movie) => movie.genres?.includes("DRAMA")).sort((a, b) => b.views - a.views);
    const trendingMovies = moviesCopy?.slice().sort((a, b) => b.views - a.views);
    const newReleases = moviesCopy?.slice().sort((a, b) => {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return dateB - dateA;
    });

    return (
        <div className="mainView">
            <div className={`browse-spinner ${loading}`}>
                <Spinner loading={loading}/>
            </div>
            {!loading && (
            <div className="view full">
                <div className="billboard-container">
                    <div className="billboard-row">
                        <div className="billboard billboard-pane">
                            <div className="billboard-motion dismiss-mask">
                                <div className="player-container inactive player">
                                    <div className="VideoContainer VideoContainer-element-dimensions">
                                        <div style={{
                                            position: "relative",
                                            width: "100%",
                                            height: "100%",
                                            overflow: "hidden"
                                        }}>
                                            <div style={{
                                                position: "relative",
                                                width: "100%",
                                                height: "100%",
                                                overflow: "hidden"
                                            }}>
                                                <video
                                                    ref={videoRef}
                                                    src={randomMovie?.trailer}
                                                    autoPlay
                                                    playsInline={true}
                                                    muted
                                                    onEnded={handleVideoEnd}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/*<div*/}
                                    {/*    className="PlayerControlsNeo__layout PlayerControlsNeo__layout--inactive">*/}
                                    {/*    <div className="PlayerControlsNeo__all-controls">*/}
                                    {/*        <div className="PlayerControlsNeo__gradient-top"></div>*/}
                                    {/*        <div className="PlayerControlsNeo__gradient-bottom"></div>*/}
                                    {/*        <div className="PlayerControlsNeo__core-controls">*/}
                                    {/*            <div className="PlayerControlsNeo__bottom-controls PlayerControlsNeo__bottom-controls--faded">*/}
                                    {/*                <div className="PlayerControlsNeo__progress-control-row PlayerControlsNeo__progress-control-row--row-standard">*/}
                                    {/*                    <div className="PlayerControlsNeo__progress-container"></div>*/}
                                    {/*                </div>*/}
                                    {/*            </div>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                                <div className="motion-background-component bottom-layer full-screen">
                                    <div className="hero-image-wrapper">
                                        {/*{videoEnded && (*/}
                                        <img className="hero static-image image-layer" src={randomMovie?.backdrop}
                                             alt={randomMovie?.title}/>
                                        {/*)}*/}
                                        <div className="trailer-vignette vignette-layer"></div>
                                        <div className="hero-vignette vignette-layer"></div>
                                        <div className="embedded-components button-layer"></div>
                                    </div>
                                    <div className="embedded-components button-layer">
                                        <div>
                                            <button
                                                className="color-supplementary ActionButtons hasIcon round ltr-11vo9g5">
                                                <div className="ltr-1st24vv">
                                                    <div className="small ltr-iyulz3">
                                                        <svg width="24" height="24" viewBox="0 0 24 24"
                                                             fill="none" xmlns="http://www.w3.org/2000/svg"
                                                             className="ltr-4z3qvp e1svuwfo1"
                                                             data-name="Refresh" aria-hidden="true">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                  d="M20.6625 7C18.9328 4.00995 15.7002 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12H24C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C16.1752 0 19.8508 2.13204 22 5.36482V2H24V8C24 8.55228 23.5523 9 23 9H17V7H20.6625Z"
                                                                  fill="currentColor">
                                                            </path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                        <span className="maturity-rating ">
                                            <span className="maturity-number">R</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="fill-container">
                                <div className="infor meta-layer">
                                    <div className="logo-and-text meta-layer">
                                        <div className="titleWrapper"
                                             style={{
                                                 transformOrigin: "left bottom 0px",
                                                 transform: "scale(1) translate3d(0px, 0px, 0px)",
                                                 transitionDuration: "1300ms",
                                                 transitionDelay: "0ms"
                                             }}>
                                            <div className="billboard-title">
                                                <img alt={randomMovie?.title} className="title-logo "
                                                     src={randomMovie?.titleImage}/>
                                            </div>
                                        </div>
                                        <div className="info-wrapper"
                                             style={{
                                                 transform: "translate3d(0px, 0px, 0px)",
                                                 transitionDuration: "1300ms",
                                                 transitionDelay: "0ms",
                                                 opacity: 1
                                             }}>
                                            <div className="info-wrapper-fade"
                                                 style={{
                                                     opacity: 1,
                                                     transitionDuration: "600ms",
                                                     transitionDelay: "200ms"
                                                 }}>
                                                <div className="episode-title-container"></div>
                                                <div className="synopsis-fade-container">
                                                    <div className="synopsis no-supplemental">
                                                        <div className="ptrack-content">
                                                            {randomMovie?.tagline}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="billboard-links button-layer forward-leaning">
                                            <NavLink exact to={`/watch/${randomMovie?.movieId}`}
                                                     className=" playLink isToolkit">
                                                <button className="color-primary hasLabel hasIcon ltr-podncoo">
                                                    <div className="ltr-1st24vv">
                                                        <div className="medium ltr-iyulz33">
                                                            <svg width="24" height="24" viewBox="0 0 24 24"
                                                                 fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="ltr-4z3qvp e1svuwfo1"
                                                                 data-name="Play" aria-hidden="true">
                                                                <path
                                                                    d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                                                                    fill="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="ltr-1npqywr"
                                                         style={{width: "1rem"}}></div>
                                                    <span className="ltr-1vh9doaa">Play</span>
                                                </button>
                                            </NavLink>
                                            <OpenModalButton
                                                buttonText={
                                                    <div className="color-secondary hasLabel hasIcon ltr-18ezbm2">
                                                        <div className="ltr-1st24vv">
                                                            <div className="medium ltr-iyulz33">
                                                                <svg width="24" height="24" viewBox="0 0 24 24"
                                                                     fill="none" xmlns="http://www.w3.org/2000/svg"
                                                                     className="ltr-4z3qvp e1svuwfo1"
                                                                     data-name="CircleI" aria-hidden="true">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                                          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                                                                          fill="currentColor"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="ltr-1npqywr" style={{width: "1rem"}}></div>
                                                        <span className="ltr-1vh9doaa">More Info</span>
                                                    </div>
                                                }
                                                // onButtonClick={() => closeMiniModal()}
                                                modalComponent={<MoreMovieInfo movie={randomMovie}/>}
                                            />
                                            {/*<button className="color-secondary hasLabel hasIcon ltr-18ezbm2">*/}
                                            {/*    <div className="ltr-1st24vv">*/}
                                            {/*        <div className="medium ltr-iyulz33">*/}
                                            {/*            <svg width="24" height="24" viewBox="0 0 24 24"*/}
                                            {/*                 fill="none" xmlns="http://www.w3.org/2000/svg"*/}
                                            {/*                 className="ltr-4z3qvp e1svuwfo1"*/}
                                            {/*                 data-name="CircleI" aria-hidden="true">*/}
                                            {/*                <path fill-rule="evenodd" clip-rule="evenodd"*/}
                                            {/*                      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"*/}
                                            {/*                      fill="currentColor"></path>*/}
                                            {/*            </svg>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*    <div className="ltr-1npqywr" style={{width: "1rem"}}></div>*/}
                                            {/*    <span className="ltr-1vh9doaa">More Info</span>*/}
                                            {/*</button>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {myListMovies?.length >= 3 && (
                    <div className="movie-section">
                        <Carousel movies={myListMovies} title={"My List"}/>
                    </div>
                )}
                <div className="movie-section">
                    <TopCarousel movies={movies} className="carousel"/>
                </div>
                <div className="movie-section">
                    <Carousel movies={newReleases} title={"New Releases"}/>
                </div>
                <div className="movie-section">
                    <Carousel movies={movies} title={"We Think You'll Love These"}/>
                </div>
                {profile?.viewedMovies.length >= 1 && (
                    <div className="movie-section">
                        <Carousel movies={movies} title={`Because you watched ${randomViewedMovie?.movie.title}`}/>
                    </div>
                )}
                <div className="movie-section">
                    <Carousel movies={trendingMovies} title={"Trending Now"}/>
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
            </div>
            )}
            <Footer/>
        </div>
    );
}

export default BrowsePage;
