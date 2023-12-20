import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './Carousel.css';
import {NavLink} from "react-router-dom";
function MovieCarousel({ movies }) {
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
            <Carousel responsive={responsive}>
                {movies.map((movie) => (
                    <NavLink to={`watch/${movie.movieId}`} key={movie?.movieId}>
                    <div className="movie-carousel-div">
                        {/*<video*/}
                        {/*    src={movie.trailer}*/}
                        {/*    autoPlay*/}
                        {/*    playsInline={true}*/}
                        {/*    controls*/}
                        {/*    muted*/}
                        {/*/>*/}
                        <img src={movie?.poster}/>
                        {/*<p>{movie.title}</p>*/}
                    </div>
                    </NavLink>
                ))}
            </Carousel>
    );
}

export default MovieCarousel;