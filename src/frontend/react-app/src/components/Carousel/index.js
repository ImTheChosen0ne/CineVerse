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
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <div className="carousel-container">
            <Carousel responsive={responsive}>
                {movies.map((movie, index) => (
                    <div
                        key={movie?.movieId}
                        className="carousel-item"
                        onMouseEnter={(event) => onMouseEnter(movie, event)}
                    >
                        <div className="movie-carousel-div">
                            <img src={movie?.poster} alt={movie?.title} />
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default MovieCarousel;
