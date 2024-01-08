import React, { useContext } from "react";

import "./MyList.css";
import Footer from "../../components/Footer";
import OpenMovieModal from "../../components/OpenMovieModal";
import {useMiniModal} from "../../context/MiniModal";
import {ProfileContext} from "../../context/Profile";
import {useSelector} from "react-redux";


function MyList() {
    const { profile } = useContext(ProfileContext);
    const { setModalContent, modalRef } = useMiniModal();
    const sessionUser = useSelector(state => state.session.user);
    const sessionProfile = sessionUser.profiles.find(profiles => profiles.profileId === profile.profileId)
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

    return (
        <div className="my-list-container">
            {/*<div className="my-list-container-title">*/}
                <div className="my-list-wrapper-title">
                    <h1>My List</h1>
                </div>
            {/*</div>*/}
            <div className="my-list-movies">
                <div className="my-list-movie-container">
                    <div className="my-list-movie-wrapper">
                        {sessionProfile?.watchLaterMovies?.map((movie, index) => (
                            <div
                                key={movie?.movieId}
                                className="my-list-movie"
                                onMouseEnter={(event) => onMouseEnter(movie, event)}
                            >
                                <div className="my-list-movie-img">
                                    <img className="poster"  src={movie?.media} alt={movie?.title} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer className="my-list-footer"/>
        </div>
    );
}

export default MyList;
