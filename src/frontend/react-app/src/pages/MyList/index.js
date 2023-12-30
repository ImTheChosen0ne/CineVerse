import React, {useEffect} from "react";

import "./MyList.css";
import Footer from "../../components/Footer";
import {useDispatch, useSelector} from "react-redux";
import OpenMovieModal from "../../components/OpenMovieModal";
import {useMiniModal} from "../../context/MiniModal";
import {getMovies} from "../../store/movies";


function MyList() {
    const dispatch = useDispatch();

    const movies = Object.values(useSelector((state) => state.movies));
    const { setModalContent, modalRef } = useMiniModal();

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    const onMouseEnter = (movie, event) => {
        const rect = event.target.getBoundingClientRect();
        const positionInfo = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };

        setModalContent(<OpenMovieModal movie={movie} position={positionInfo}/>);
    };

    return (
        <div className="my-list-container">
            <div className="my-list-container-title">
                <div className="my-list-wrapper-title">
                    <h1>My List</h1>
                </div>
            </div>
            <div className="my-list-movies">
                <div className="my-list-movie-container">
                    <div className="my-list-movie-wrapper">
                        {movies.map((movie, index) => (
                            <div
                                key={movie?.movieId}
                                className="my-list-movie"
                                onMouseEnter={(event) => onMouseEnter(movie, event)}
                            >
                                <div className="my-list-movie-img">
                                    <img className="poster"  src={movie?.poster} alt={movie?.title} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer className="my-list-footer"/>
        </div>
    );
}

export default MyList;
