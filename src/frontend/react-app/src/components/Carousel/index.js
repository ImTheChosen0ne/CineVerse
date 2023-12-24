// MovieCarousel.jsx

import React, {useEffect, useRef, useState} from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './Carousel.css';
import OpenMovieModal from "../OpenMovieModal";
import { useMiniModal } from "../../context/MiniModal";

function MovieCarousel({ movies }) {
    const { setModalContent, modalRef } = useMiniModal();
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

    return (
        <Carousel
            additionalTransfrom={54}
            arrows
            autoPlaySpeed={3000}
            centerMode={false}
            className=""
            containerClass="carousel-container"
            dotListClass=""
            focusOnSelect={false}
            infinite
            itemClass="carousel-item"
            keyBoardControl
            minimumTouchDrag={20}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            partialVisbile
            responsive={{
                desktop: {
                    breakpoint: {
                        max: 3000,
                        min: 1381
                    },
                    items: 6,
                    partialVisibilityGutter: 18
                },
                mobile: {
                    breakpoint: {
                        max: 1381,
                        min: 0
                    },
                    items: 5,
                    partialVisibilityGutter: 22
                },
                tablet: {
                    breakpoint: {
                        max: 1024,
                        min: 464
                    },
                    items: 4,
                    partialVisibilityGutter: 27
                }
            }}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass="slider"
            slidesToSlide={6}
            swipeable
        >
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
    );
}

export default MovieCarousel;
