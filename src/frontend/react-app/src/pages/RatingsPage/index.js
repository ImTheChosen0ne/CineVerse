import React, { useState } from "react";
import "./Ratings.css"
import Footer from "../../components/Footer";
import {useDispatch, useSelector} from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import {createMovieRating, deleteMovieRating, updateMovieRating} from "../../store/session";

function Ratings() {
    const { profileName } = useParams();
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user);
    const selectedProfile = sessionUser.profiles.find(user => user.name === profileName)

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const handleRating = async (profileRating, movie) => {

        const existingRating = selectedProfile.profileRatings.find(existingMovieRating =>
            existingMovieRating.movie.movieId === movie.movieId
        );


        const updatedRating ={
            ...existingRating,
            date: formatDate(new Date()),
            profileRating: profileRating,
        }

        if (existingRating && profileRating === existingRating.profileRating) {
            await dispatch(deleteMovieRating(existingRating, selectedProfile.profileId));
        } else if (existingRating) {
            await dispatch(updateMovieRating(selectedProfile, updatedRating));
        }

    }

    return (
        <div className="profileRating-page">
            <div className="profileRating-container">
                <div className="profileRating-center">
                    <div className="profileRating-center">
                        <header className="activity-header">
                            <div className="activity-header-info">
                                <h1>Activity for {selectedProfile.name}</h1>
                                <nav className="activity-toggle">
                                    <NavLink to={`/account/${selectedProfile.name}/viewed`} className="first choice icon viewing">
                                        Watching
                                    </NavLink>
                                    <span className="choice icon profileRating">Rating</span>
                                </nav>
                            </div>
                            <img src={selectedProfile.img} alt="profile image"/>
                        </header>
                        {selectedProfile.profileRatings.map((profileRating) => (
                            <ul key={profileRating.ratingId} className="profile-activity-profileRatings">
                                <li className="profile-activity-row">
                                    <div className="profile-activity-row-date">{profileRating.date}</div>
                                    <div className="profile-activity-row-title">
                                        <a href="">{profileRating.movie.title}</a>
                                    </div>
                                    <div className="profile-activity-row-profileRating">
                                        <div>
                                            <button className="profileRating-button" onClick={() => handleRating("dislike", profileRating.movie)}>
                                                {profileRating.profileRating !== "dislike" ?
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                     className="default-ltr-cache-4z3qvp e1svuwfo1"
                                                     data-name="ThumbsDown" aria-hidden="true">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                          d="M13.304 15.2268C13.1053 15.5447 13 15.912 13 16.2868V20H12.1623C11.2848 20 10.5715 19.4471 10.3927 18.6887C10.1767 17.7724 10 16.7728 10 16C10 15.4152 10.1024 14.8081 10.2464 14.2496L10.5685 13H9.27807H6.5C5.67157 13 5 12.3284 5 11.5C5 11.4071 5.00833 11.3169 5.02404 11.2301L5.10454 10.7851L4.82357 10.4308C4.6206 10.1748 4.5 9.85286 4.5 9.5C4.5 9.14714 4.6206 8.82521 4.82357 8.56924L5.10454 8.2149L5.02405 7.76991C5.00833 7.68305 5 7.59293 5 7.5C5 7.0099 5.23399 6.57474 5.60058 6.29938L5.99996 5.99939L6 5.49989C6.00006 4.67151 6.67161 4 7.5 4H10H11H11.3772C12.3446 4 13.3056 4.15595 14.2233 4.46185L15.7163 4.95954C16.7754 5.31257 17.8838 5.49494 19 5.4999V10.2457L16.9644 10.8273C16.2507 11.0312 15.638 11.4924 15.2446 12.1219L13.304 15.2268ZM13.5 22C14.3284 22 15 21.3284 15 20.5V16.2868L16.9406 13.1819C17.0717 12.9721 17.276 12.8183 17.5139 12.7503L19.5494 12.1687C20.408 11.9234 21 11.1387 21 10.2457V5.45319C21 4.37447 20.1255 3.5 19.0468 3.5C18.1298 3.5 17.2188 3.35216 16.3488 3.06217L14.8557 2.56448C13.7341 2.19061 12.5595 2 11.3772 2H11H10H7.5C5.73076 2 4.26812 3.31275 4.03301 5.01735C3.39612 5.65042 3 6.52905 3 7.5C3 7.56309 3.00168 7.62585 3.005 7.68825C2.6847 8.21698 2.5 8.83782 2.5 9.5C2.5 10.1622 2.6847 10.783 3.005 11.3117C3.00168 11.3742 3 11.4369 3 11.5C3 13.433 4.567 15 6.5 15H8.06624C8.02476 15.3245 8 15.6603 8 16C8 17.0114 8.22123 18.1939 8.44607 19.1476C8.85988 20.903 10.4572 22 12.1623 22H13.5Z"
                                                          fill="currentColor"></path>
                                                </svg>
                                                :
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                     className="default-ltr-cache-4z3qvp e1svuwfo1 active"
                                                     data-name="ThumbsDownFill" aria-hidden="true">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                          d="M10.593 17.7442L10.687 18.4959C10.8658 19.9265 12.0819 21 13.5236 21C13.7867 21 14 20.7867 14 20.5236V17.2868C14 17.0994 14.0527 16.9157 14.152 16.7568L16.0926 13.6519C16.3548 13.2323 16.7633 12.9248 17.2391 12.7888L19.2747 12.2072C19.704 12.0846 20 11.6922 20 11.2457V5.68387C20 5.30618 19.6938 5 19.3161 5C18.126 5 16.9565 4.68942 15.9232 4.09895L15.75 4C14.6032 3.34469 13.3053 3 11.9844 3H11H8H7.5C6.67157 3 6 3.67157 6 4.5C6 4.88418 6.14443 5.23462 6.38195 5.5H6C5.17157 5.5 4.5 6.17157 4.5 7C4.5 7.53991 4.78525 8.0132 5.21328 8.27737C4.522 8.41118 4 9.01963 4 9.75C4 10.5784 4.67157 11.25 5.5 11.25H5.67055C5.26638 11.5187 5 11.9783 5 12.5C5 13.3284 5.67157 14 6.5 14H10.875L10.593 16.2558C10.5312 16.75 10.5312 17.25 10.593 17.7442Z"
                                                          fill="currentColor"></path>
                                                </svg>
                                                }
                                            </button>
                                            <button className="profileRating-button" onClick={() => handleRating("like", profileRating.movie)}>
                                                {profileRating.profileRating !== "like" ?
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg"
                                                         className="default-ltr-cache-4z3qvp e1svuwfo1"
                                                         data-name="ThumbsUp"
                                                         aria-hidden="true">
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                              d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
                                                              fill="currentColor"></path>
                                                    </svg>
                                                    :
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg"
                                                         className="default-ltr-cache-4z3qvp e1svuwfo1 active"
                                                         data-name="ThumbsUpFill" aria-hidden="true">
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                              d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z"
                                                              fill="currentColor"></path>
                                                    </svg>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
            </div>
            <Footer className="account-footer"/>
        </div>
    );
}

export default Ratings;
