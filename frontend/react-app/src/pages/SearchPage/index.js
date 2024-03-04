import React, {useEffect} from "react";
import "./Search.css"
import {useDispatch, useSelector} from "react-redux";
import {getMovies} from "../../store/movies";
import OpenMovieModal from "../../components/OpenMovieModal";
import {useMiniModal} from "../../context/MiniModal";
import {useLocation} from "react-router-dom";
import Footer from "../../components/Footer";

function Search() {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query");
    const { setModalContent, modalRef } = useMiniModal();
    const movies = Object.values(useSelector((state) => state.movies.movies));

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    const filteredMovies = movies.filter((movie) => movie.title?.toLowerCase().includes(query?.toLowerCase()));

    const onMouseEnter = (movie, event) => {
        const container = event.currentTarget.querySelector('.title-card-container');
        const rect = container.getBoundingClientRect();
        const positionInfo = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
        setModalContent(<OpenMovieModal movie={movie} position={positionInfo}/>);
    };

    return (
        <div className="search-results">
            <div className="search-movies">
                <div className="search-movie-container">
                    <div className="search-movie-wrapper">
                    {filteredMovies.map((movie) => (
                        <div className="ltr-1cjyscz" onMouseEnter={(event) => onMouseEnter(movie, event)}>
                            <div className="title-card-container">
                                <div id="title-card-0-0" className="title-card">
                                    <div className="ptrack-content">
                                        <a className="slider-refocus">
                                            <div className="boxart-size-16x9 boxart-container boxart-rounded">
                                                <img className="boxart-image boxart-image-in-padded-container"
                                                     src={movie?.backdrop} alt={movie?.title}/>
                                                <div className="fallback-text-container">
                                                    <p className="fallback-text">{movie.title}</p>
                                                </div>
                                                <div style={{
                                                    opacity: 1,
                                                    position: "absolute",
                                                    bottom: 0,
                                                    marginLeft: "5px"
                                                }}>
                                                    <div className="previewModal--player-titleTreatmentWrapper"
                                                         style={{opacity: 1}}>
                                                        <div
                                                            className="previewModal--player-titleTreatment-left previewModal--player-titleTreatment mini-modal has-smaller-buttons mini-modal has-smaller-buttons"
                                                            style={{width: "40%"}}>
                                                            <img className="previewModal--player-titleTreatment-logo"
                                                                 alt="" src={movie.titleImage}
                                                                 style={{width: "100%", opacity: 1}}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="bob-container"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Search;
