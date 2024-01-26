import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './NewAndPopular.css';
import { getMovies } from "../../store/movies";
import Carousel from "../../components/Carousel";
import Footer from "../../components/Footer";
import TopCarousel from "../../components/Carousel/TopCarousel";
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
                        <TopCarousel movies={movies}/>
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
                </div>
            )}
            <Footer/>
        </div>
    );
}

export default NewAndPopular;
