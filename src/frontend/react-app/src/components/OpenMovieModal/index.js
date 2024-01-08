import React, {useContext, useEffect, useRef, useState} from "react";
import { useMiniModal } from "../../context/MiniModal";
import "./OpenMovieModal.css";
import OpenModalButton from "../OpenModalButton";
import MoreMovieInfo from "../MoreMovieInfoModal";
import {useDispatch, useSelector} from "react-redux";
import {
  createDislike,
  createLike,
  createWatchLaterMovie,
  deleteDislike,
  deleteLike,
  deleteWatchLaterMovie
} from "../../store/session";
import {ProfileContext} from "../../context/Profile";


function OpenMovieModal({movie, position}) {
  const ulRef = useRef();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const { closeMiniModal } = useMiniModal();
  const { profile, updateProfile } = useContext(ProfileContext);
  const sessionUser = useSelector(state => state.session.user);
  const updatedProfile = sessionUser.profiles.find(profiles => profiles.profileId === profile.profileId)
  let [liked, setLiked] = useState(false);
  let [disliked, setDisliked] = useState(false);
  let [watchLater, setWatchLater] = useState(false);
  const [showLikeMenu, setShowLikeMenu] = useState(false);
  const likedRef = useRef();

  const onMouseLeave = () => {
    closeMiniModal();
  };

  const openMenu = () => {
    setShowLikeMenu(true);
  }
  const closeMenu = () => {
    setShowLikeMenu(false);
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const modalStyle = {
    position: "absolute",
    justifyContent: "center",
    willChange: "scroll-position",
    display: "flex",
    top: position.top + window.scrollY  - 100 + "px",
    left: position.left - 23 + "px",
    width: position.width + 48 + "px",
    height: position.height + 220 + "px"
  };

  if (updatedProfile.likedMovies) {
    for (let likedMovie of updatedProfile.likedMovies) {
      if (likedMovie.movieId === movie.movieId) liked = true;
    }
  }

  if (updatedProfile.watchLaterMovies) {
    for (let watchMovie of updatedProfile.watchLaterMovies) {
      if (watchMovie.movieId === movie.movieId) watchLater = true;
    }
  }

  if (updatedProfile.dislikedMovies) {
    for (let dislikedMovie of updatedProfile.dislikedMovies) {
      if (dislikedMovie.movieId === movie.movieId) disliked = true;
    }
  }


  const handleLikeMovie = async (movie) => {
    if (liked) {
      await dispatch(deleteLike(movie, profile.profileId));
      updateProfile(updatedProfile);
      setLiked(false);
    } else if (disliked) {
      await dispatch(deleteDislike(movie, profile.profileId));
      await dispatch(createLike(profile, movie));
      updateProfile(updatedProfile);
      setLiked(true);
      setDisliked(false);
    } else {
      await dispatch(createLike(profile, movie));
      updateProfile(updatedProfile);
      setLiked(true);
    }
  }

  const handleDislikeMovie = async (movie) => {
    if (disliked) {
      await dispatch(deleteDislike(movie, profile.profileId));
      updateProfile(updatedProfile);
      setDisliked(false);
    } else if (liked) {
      await dispatch(deleteLike(movie, profile.profileId));
      await dispatch(createDislike(profile, movie));
      updateProfile(updatedProfile);
      setDisliked(true);
      setLiked(false);
    } else {
      await dispatch(createDislike(profile, movie));
      updateProfile(updatedProfile);
      setDisliked(true);
    }
  }

  const handleWatchLaterMovie = async (movie) => {
    if (watchLater) {
      await dispatch(deleteWatchLaterMovie(movie, profile.profileId))
      updateProfile(updatedProfile)
      setWatchLater(false);
    } else if (!watchLater) {
      await dispatch(createWatchLaterMovie(profile, movie))
      updateProfile(updatedProfile)
      setWatchLater(true);
    }
  }

  const renderLikedStatus = () => {
    if (liked) {
      return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
               className="ltr-4z3qvp e1svuwfo1" data-name="ThumbsUpFill" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z"
                  fill="currentColor"></path>
          </svg>
      );
    } else if (disliked) {
      return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg"
               className="ltr-4z3qvp e1svuwfo1 disliked" data-name="ThumbsUpFill"
               aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z"
                  fill="currentColor"></path>
          </svg>
      );
    } else {
      return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
               className="ltr-4z3qvp e1svuwfo1" data-name="ThumbsUp" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
                  fill="currentColor"></path>
          </svg>
      );
    }
  };

  return (
      <div style={modalStyle} onMouseLeave={onMouseLeave}>
        <div className="modal-wrapper">
          {/*<div className="modal-content">*/}
          <div className="video-wrapper">
            <div className="video-container">
              <div className="video">
                <video
                    src={movie?.trailer}
                    autoPlay
                    playsInline={true}
                    controls
                    muted
                    height="200px"
                    width="350px"
                />
              </div>
            </div>
          </div>
          <div className="movie-info">
            <div className="movie-info-button-container">
              <a>
                <button className="button-container play">
                  <div className="button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         className="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-hidden="true">
                      <path
                          d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                          fill="currentColor"></path>
                    </svg>
                  </div>
                </button>
              </a>
              <div>
                <button className="button-container" onClick={() => handleWatchLaterMovie(movie)}>
                  <div className="button">
                    {watchLater ?
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className="ltr-4z3qvp e1svuwfo1" data-name="Checkmark" aria-hidden="true">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                              fill="currentColor"></path>
                      </svg>
                          :
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                           className="ltr-4z3qvp e1svuwfo1" data-name="Plus" aria-hidden="true">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
                              fill="currentColor"></path>
                      </svg>
                      }
                    </div>
                  </button>
                </div>
                <div>
                  <button className="button-container" onMouseEnter={openMenu} onClick={() => handleLikeMovie(movie)}>
                    <div className="button">
                      {renderLikedStatus()}
                    </div>
                  </button>
                  <div className={`liked-overlay-mini ${showLikeMenu ? 'visible' : ''}`} ref={likedRef} onMouseLeave={closeMenu}>
                    <div data-uia="thumbs-selection-popover-mini">
                      <div>
                        <div className="selection-mini">
                          <div className="disliked-liked-selection-mini">
                            <button className="selection-button-mini" onClick={() => handleDislikeMovie(movie)}>
                              {disliked ?
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="ltr-4z3qvp e1svuwfo1 disliked" data-name="ThumbsUpFill"
                                       aria-hidden="true">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z"
                                          fill="currentColor"></path>
                                  </svg>
                                  :
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="ltr-4z3qvp e1svuwfo1 disliked" data-name="ThumbsUp"
                                       aria-hidden="true">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
                                          fill="currentColor"></path>
                                  </svg>
                              }
                            </button>
                          </div>
                          <div className="disliked-liked-selection-mini">
                            <button className="selection-button-mini like" onClick={() => handleLikeMovie(movie)}>
                              {liked ?
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="ltr-4z3qvp e1svuwfo1" data-name="ThumbsUpFill"
                                       aria-hidden="true">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z"
                                          fill="currentColor"></path>
                                  </svg>
                                  :
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="ltr-4z3qvp e1svuwfo1" data-name="ThumbsUp"
                                       aria-hidden="true">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
                                          fill="currentColor"></path>
                                  </svg>
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="more-info-button">
                  <OpenModalButton
                      buttonText={
                        <div className="button">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                               className="ltr-4z3qvp e1svuwfo1" data-name="ChevronDown" aria-hidden="true">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z"
                                  fill="currentColor"></path>
                          </svg>
                        </div>
                      }
                      onButtonClick={() => closeMiniModal()}
                      modalComponent={<MoreMovieInfo movie={movie}/>}
                  />
                  {/*<button className="button-container">*/}
                  {/*  <div className="button">*/}
                  {/*    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"*/}
                  {/*         className="ltr-4z3qvp e1svuwfo1" data-name="ChevronDown" aria-hidden="true">*/}
                  {/*      <path fill-rule="evenodd" clip-rule="evenodd"*/}
                  {/*            d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z"*/}
                  {/*            fill="currentColor"></path>*/}
                  {/*    </svg>*/}
                  {/*  </div>*/}
                  {/*</button>*/}
                </div>
              </div>
              <div>
                <div>{movie?.runtime}</div>
              </div>
              <div>
                {movie?.genres.map((genre, index) => (
                    <p key={index}>{genre}</p>
                ))}
              </div>
            </div>
            {/*</div>*/}
          </div>
        </div>
  );
}

export default OpenMovieModal;
