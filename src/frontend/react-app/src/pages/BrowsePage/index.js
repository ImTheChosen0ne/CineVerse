import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import './BrowsePage.css';
import { getMovies } from "../../store/movies";

function BrowsePage() {
    const dispatch = useDispatch();
    const movies = Object.values(useSelector((state) => state.movies));

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    return (
        <div>
            <h1>Browse page</h1>
            {movies.map((movie) => (
                <div key={movie.movieId}>
                    <p>{movie.title}</p>
                </div>
            ))}
        </div>
    );
}

export default BrowsePage;
