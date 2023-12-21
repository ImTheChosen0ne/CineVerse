// MovieCarousel.jsx

import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './Carousel.css';
import OpenModalButton from "../OpenModalButton";
import OpenMovieModal from "../OpenMovieModal";

function MovieCarousel({ movies }) {
    // const [hoveredIndex, setHoveredIndex] = useState(null);
    // const [position, setPosition] = useState({ top: 0, left: 0 });
    // const [display, setDisplay] = useState(false);
    //
    // const handleHover = (index, event) => {
    //     setHoveredIndex(index);
    //     setDisplay(true)
    //     // Calculate the position of the hovered item
    //     const rect = event.target.getBoundingClientRect();
    //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //     setPosition({ top: rect.top + scrollTop, left: rect.left });
    // };
    //
    // const handleMouseLeave = () => {
    //     setDisplay(false)
    //     setHoveredIndex(null);
    // };

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
                        // onMouseEnter={(event) => handleHover(index, event)}
                        // onMouseLeave={handleMouseLeave}
                    >
                        <div className="movie-carousel-div">
                            <img src={movie?.poster} alt={movie?.title} />
                        </div>
                    </div>
                ))}
            </Carousel>

            {/*{display && (*/}
            {/*    <div*/}
            {/*        className="extra-info"*/}
            {/*        style={{ top: position.top - 60, left: position.left - 30}}*/}
            {/*        onMouseLeave={handleMouseLeave}*/}
            {/*    >*/}
            {/*        <div>*/}
            {/*            <div>*/}
            {/*                <video*/}
            {/*                    src={movies[hoveredIndex].trailer}*/}
            {/*                    autoPlay*/}
            {/*                    playsInline={true}*/}
            {/*                    controls*/}
            {/*                    muted*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <button>Play</button>*/}
            {/*                <button>My list</button>*/}
            {/*                <button>Like</button>*/}
            {/*                <OpenModalButton*/}
            {/*                    movie={movies[hoveredIndex]}*/}
            {/*                    modalComponent={<OpenMovieModal movie={movies[hoveredIndex]}/>}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <div>{movies[hoveredIndex].runtime}</div>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                {movies[hoveredIndex].genres.map((genre, index) => (*/}
            {/*                    <p key={index}>{genre}</p>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}

export default MovieCarousel;
