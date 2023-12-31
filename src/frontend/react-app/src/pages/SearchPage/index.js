import React, {useEffect} from "react";
import "./Search.css"
import {useDispatch, useSelector} from "react-redux";
import {getMovies} from "../../store/movies";
import OpenMovieModal from "../../components/OpenMovieModal";
import {useMiniModal} from "../../context/MiniModal";
import {useLocation} from "react-router-dom";

function Search() {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query");
    const { setModalContent, modalRef } = useMiniModal();
    const movies = Object.values(useSelector((state) => state.movies));

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    const filteredMovies = movies.filter(
        (movie) =>
            movie.title?.toLowerCase().includes(query?.toLowerCase())
    );

    console.log(filteredMovies)

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
        <div className="search-results">
            <div className="search-movies">
                <div className="search-movie-container">
                    <div className="search-movie-wrapper">
            {filteredMovies.map((movie) => (
                    <div
                        key={movie?.movieId}
                        className="search-movie"
                        onMouseEnter={(event) => onMouseEnter(movie, event)}
                    >
                        <div className="search-movie-img">
                            <img className="poster" src={movie?.poster} alt={movie?.title}/>
                        </div>
                    </div>
            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
