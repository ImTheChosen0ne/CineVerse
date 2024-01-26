import React, {useContext, useEffect, useState} from "react";

import "./MyList.css";
import Footer from "../../components/Footer";
import OpenMovieModal from "../../components/OpenMovieModal";
import {useMiniModal} from "../../context/MiniModal";
import {ProfileContext} from "../../context/Profile";
import {useSelector} from "react-redux";
import Spinner from "../../components/Spinner";


function MyList() {
    const { profile } = useContext(ProfileContext);
    const { setModalContent, modalRef } = useMiniModal();
    const sessionUser = useSelector(state => state.session.user);
    const sessionProfile = sessionUser.profiles.find(profiles => profiles.profileId === profile.profileId)
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchData = async () => {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        };
        fetchData();
    }, []);

    return (
        <div className="my-list-container">
                <div className="my-list-wrapper-title">
                    <h1>My List</h1>
                </div>
            <div className="list-profiles browse-spinner">
                <Spinner loading={loading}/>
            </div>
            {!loading && (
                <div className="my-list-movies">
                    <div className="my-list-movie-container">
                        {sessionProfile.watchLaterMovies.length === 0 ?
                            <div className="galleryMessage">You haven't added any titles to your list yet.</div>
                            :
                            <div className="my-list-movie-wrapper">
                                {sessionProfile?.watchLaterMovies?.sort((a, b) => a.movieId - b.movieId).map((movie, index) => (
                                    <div className="ltr-1cjyscz" onMouseEnter={(event) => onMouseEnter(movie, event)}>
                                        <div className="title-card-container">
                                            <div id="title-card-0-0" className="title-card">
                                                <div className="ptrack-content">
                                                    <a className="slider-refocus">
                                                        <div
                                                            className="boxart-size-16x9 boxart-container boxart-rounded">
                                                            <img
                                                                className="boxart-image boxart-image-in-padded-container"
                                                                src={movie?.backdrop} alt={movie?.title}/>
                                                            <div className="fallback-text-container">
                                                                <p className="fallback-text"></p>
                                                            </div>
                                                            <div style={{
                                                                opacity: 1,
                                                                position: "absolute",
                                                                bottom: 0,
                                                                marginLeft: "5px"
                                                            }}>
                                                                <div
                                                                    className="previewModal--player-titleTreatmentWrapper"
                                                                    style={{opacity: 1}}>
                                                                    <div
                                                                        className="previewModal--player-titleTreatment-left previewModal--player-titleTreatment mini-modal has-smaller-buttons mini-modal has-smaller-buttons"
                                                                        style={{width: "40%"}}>
                                                                        <img
                                                                            className="previewModal--player-titleTreatment-logo"
                                                                            alt="" src={movie.titleImage}
                                                                            style={{width: "100%", opacity: 1}}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div className="bob-container"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            )}
            <Footer className="my-list-footer"/>
        </div>
    );
}

export default MyList;
