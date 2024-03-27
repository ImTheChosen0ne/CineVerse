import React, {useEffect, useState} from "react";
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
        const container = event.currentTarget.querySelector('.title-card-container');
        const rect = container.getBoundingClientRect();

        const positionInfo = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };

        setModalContent(<OpenMovieModal movie={movie} position={positionInfo}/>);
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    const [itemsPerSlide, setItemsPerSlide] = useState(calculateItemsPerSlide(window.innerWidth));
    const [slideWidth, setSlideWidth] = useState(calculateSlideWidth(window.innerWidth));

    function calculateItemsPerSlide(windowWidth) {
        if (windowWidth >= 1400) {
            return 6;
        } else if (windowWidth >= 1100 && windowWidth <= 1399) {
            return 5;
        } else if (windowWidth >= 800 && windowWidth <= 1099) {
            return 4;
        } else if (windowWidth >= 500 && windowWidth <= 799) {
            return 3;
        } else {
            return 2;
        }
    }

    function calculateSlideWidth(windowWidth) {
        if (windowWidth >= 1400) {
            return 100;
        } else if (windowWidth >= 1100 && windowWidth <= 1399) {
            return 100;
        } else if (windowWidth >= 800 && windowWidth <= 1099) {
            return 100;
        } else if (windowWidth >= 500 && windowWidth <= 799) {
            return 100;
        } else {
            return 100;
        }
    }

    useEffect(() => {
        function handleResize() {
            const newWidth = window.innerWidth;

            const newItemsPerSlide = calculateItemsPerSlide(newWidth);
            const newSlideWidth = calculateSlideWidth(newWidth);

            setItemsPerSlide(newItemsPerSlide);
            setSlideWidth(newSlideWidth);

            setCurrentSlide(prevSlide => Math.min(prevSlide, Math.ceil(movies?.length / newItemsPerSlide) - 1));
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [movies?.length]);

    const totalSlides = Math.ceil(movies?.length / itemsPerSlide);

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
        <div className="carouselRow carouselRow-title-card">
            <h2 className="rowHeader">
                <a className="rowTitle">
                    <div className="row-header-title">{title}</div>
                    {/*<div className="aro-row-header more-visible">*/}
                    {/*    <div className="see-all-link">Explore All</div>*/}
                    {/*    <div className="aro-row-chevron icon-akiraCaretRight"></div>*/}
                    {/*</div>*/}
                </a>
            </h2>
            <div className="rowContainer">
                <div className="ptrack-container">
                    <div className="rowContent slider-hover">
                        <div className="slider">
                            <span className={`handle handlePrev ${showCaret}`} role="button" onClick={handlePrevSlide}>
                                <b className="indicator-icon icon-leftCaret"></b>
                            </span>
                            <div className="sliderMask showPeek">
                                <div className={`sliderContent row-with-x-columns ${animation}`} style={sliderStyle}>
                                    {movies?.map((movie, index) => (
                                        <div key={movie?.movieid} className={`slider-item slider-item-${index}`} onMouseEnter={(event) => onMouseEnter(movie, event)}>
                                            <div className="title-card-container">
                                                <div className="ptrack-content">
                                                    <div className="boxart-size-16x9 boxart-container boxart-rounded">
                                                        <img className="boxart-image boxart-image-in-padded-container"
                                                             src={movie?.backdrop} alt={movie?.title}/>
                                                        <div className="fallback-text-container">
                                                            <p className="fallback-text">{movie.title}</p>
                                                        </div>
                                                        <div style={{opacity: 1, position:"absolute", bottom: 0, marginLeft: "5px"}}>
                                                            <div className="previewModal--player-titleTreatmentWrapper" style={{opacity: 1}}>
                                                                <div className="previewModal--player-titleTreatment-left previewModal--player-titleTreatment mini-modal has-smaller-buttons mini-modal has-smaller-buttons" style={{ width: "40%"}}>
                                                                    <img className="previewModal--player-titleTreatment-logo" alt={movie.title} src={movie.titleimage} style={{width: "100%", opacity: 1}}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <span className="handle handleNext active" role="button" onClick={handleNextSlide}
                                  style={movies?.length < 6 ? {display: "none"} : {display: ""}}>
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
