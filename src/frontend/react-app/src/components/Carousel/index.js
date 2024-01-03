import React, {useRef, useState} from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './Carousel.css';
import OpenMovieModal from "../OpenMovieModal";
import { useMiniModal } from "../../context/MiniModal";

function MovieCarousel({ movies }) {
    const { setModalContent, modalRef } = useMiniModal();
    const carouselRef = useRef(null);

    const [infinite, setInfinite] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
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

    const handleAfterChange = (previousSlide, { currentSlide }) => {

        setInfinite(true);

        // if (infinite && carouselRef.current) {
        //     const nextSlide = (carouselRef.current.state.currentSlide) // Assuming 6 slides are visible at a time
        //     carouselRef.current.goToSlide(nextSlide);
        // }

        // setInfinite(true);
    };
    const handleBeforeChange = () => {
        setInfinite(true);
    };


    return (
        <div>
            {/*<div className="filler"></div>*/}
        <Carousel
            additionalTransfrom={54}
            arrows
            autoPlaySpeed={3000}
            centerMode={false}
            className=""
            containerClass="carousel-container"
            dotListClass=""
            focusOnSelect={false}
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
            afterChange={handleAfterChange}
            // beforeChange={handleBeforeChange}
            infinite={infinite}
            // ref={carouselRef}
            key={infinite ? 'infinite-carousel' : 'normal-carousel'}
        >
                {movies.map((movie, index) => (
                    <div
                        key={movie?.movieId}
                        className="carousel-item"
                        onMouseEnter={(event) => onMouseEnter(movie, event)}
                    >
                        <div className="movie-carousel-div">
                            <img className="poster"  src={movie?.media} alt={movie?.title} />
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default MovieCarousel;
