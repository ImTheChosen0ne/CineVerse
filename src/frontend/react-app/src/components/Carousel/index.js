// MovieCarousel.jsx

import React, {useRef, useState} from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './Carousel.css';
import OpenMovieModal from "../OpenMovieModal";
import { useMiniModal } from "../../context/MiniModal";

function MovieCarousel({ movies }) {
    const { setModalContent, modalRef } = useMiniModal();
    const modalWrapperRef = useRef(null);
    const [selectedMovieIndex, setSelectedMovieIndex] = useState(null);

    const onMouseEnter = (movie, event) => {
        const rect = event.target.getBoundingClientRect();
        const positionInfo = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };

        setModalContent(<OpenMovieModal movie={movie} position={positionInfo} />);
    };

    const responsive = {
        all: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            partialVisibilityGutter: 73
        }
    };

    return (
        <div className="carousel-container">
            <Carousel responsive={responsive} infinite={false} slidesToSlide={6} partialVisible={true}>
                {movies.map((movie, index) => (
                    <div
                        key={movie?.movieId}
                        className="carousel-item"
                        onMouseEnter={(event) => onMouseEnter(movie, event)}
                    >
                        <div className="movie-carousel-div">
                            <img className="poster"  src={movie?.poster} alt={movie?.title} />
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default MovieCarousel;
