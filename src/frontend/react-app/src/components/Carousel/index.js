import React, { useState } from "react";
import "react-multi-carousel/lib/styles.css";
import './Carousel.css';
import OpenMovieModal from "../OpenMovieModal";
import { useMiniModal } from "../../context/MiniModal";
import "./Carousel.css"

function Carousel({ movies, title }) {
    const { setModalContent } = useMiniModal();

    const [showCaret, setShowCaret] = useState("")

    const [animation, setAnimation] = useState("")
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

    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 5; // Replace with the actual number of slides
    const slideWidth = 83.3;
    const handleNextSlide = () => {
        setAnimation("animating");
        setShowCaret("active");
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
    };

    const sliderStyle = {transform: `translate3d(-${currentSlide * slideWidth}%, 0px, 0px)`};

    return (
        <div className="lolomoRow lolomoRow_title_card ltr-0" data-list-context="similars">
            <h2 className="rowHeader ltr-0">
                <a className="rowTitle ltr-0" historystate="[object Object]">
                    <div className="row-header-title">{title}</div>
                    {/*<div className="aro-row-header more-visible">*/}
                    {/*    <div className="see-all-link">Explore All</div>*/}
                    {/*    <div className="aro-row-chevron icon-akiraCaretRight"></div>*/}
                    {/*</div>*/}
                </a>
            </h2>
            <div className="rowContainer rowContainer_title_card" id="row-3">
                <div className="ptrack-container">
                    <div className="rowContent slider-hover-trigger-layer">
                        <div className="slider">
                            <span className={`handle handlePrev ${showCaret}`} role="button"  onClick={handlePrevSlide}>
                                <b className="indicator-icon icon-leftCaret"></b>
                            </span>
                            <div className="sliderMask showPeek">
                                <div className={`sliderContent row-with-x-columns ${animation}`} style={sliderStyle}>
                                    {movies.map((movie, index) => (
                                        <div key={movie?.movieId} className={`slider-item slider-item-${index}`} onMouseEnter={(event) => onMouseEnter(movie, event)}>
                                            <div className="title-card-container ltr-0">
                                                <div className="ptrack-content">
                                                    <div className="boxart-size-16x9 boxart-container boxart-rounded">
                                                        <img className="boxart-image boxart-image-in-padded-container"
                                                             src={movie?.media} alt={movie?.title}/>
                                                        <div className="fallback-text-container">
                                                            <p className="fallback-text"></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <span className="handle handleNext active" role="button" onClick={handleNextSlide} style={movies.length < 6 ? { display: "none" } : { display: "" }}>
                                <b className="indicator-icon icon-rightCaret"></b>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Carousel;
