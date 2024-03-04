import React, { useContext, useEffect, useRef, useState } from "react";
import { useMiniModal } from "../../context/MiniModal";
import "./OpenMovieModal.css";
import OpenModalButton from "../OpenModalButton";
import MoreMovieInfo from "../MoreMovieInfoModal";
import {useDispatch, useSelector} from "react-redux";
import {
  createMovieRating, createViewedMovie,
  createWatchLaterMovie,
  deleteMovieRating,
  deleteWatchLaterMovie, updateMovieRating, updateViewedMovie
} from "../../store/session";
import {ProfileContext} from "../../context/Profile";
import {NavLink} from "react-router-dom";

function OpenMovieModal({ movie, position }) {
  const ulRef = useRef();
  const likedRef = useRef();
  const dispatch = useDispatch();
  const videoRef = useRef();

  const { closeMiniModal } = useMiniModal();
  const { profile, updateProfile } = useContext(ProfileContext);

  const sessionUser = useSelector(state => state.session.user);
  const updatedProfile = sessionUser.profiles.find(profiles => profiles?.profileId === profile?.profileId)

  const [showMenu, setShowMenu] = useState(false);
  let [superLiked, setSuperLiked] = useState(false);
  let [liked, setLiked] = useState(false);
  let [disliked, setDisliked] = useState(false);
  let [watchLater, setWatchLater] = useState(false);
  const [showLikeMenu, setShowLikeMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

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

  // useEffect(() => {
  //   const videoElement = videoRef.current;
  //
  //   videoElement.muted = isMuted;
  //
  // }, [isMuted]);

  const modalStyle = {
    position: "absolute",
    justifyContent: "center",
    willChange: "scroll-position",
    display: "flex",
    flexDirection: "column",
    top: position.top + window.scrollY  - 100 + "px",
    left: `${position.left}px`,
    transformOrigin: "center center 0",
    transform: "translateX(-57px) translateY(0) scaleX(1) scaleY(1) translateZ(0)",
    zIndex: 3,
    opacity: 1,
    boxShadow: "rgba(0,0,0,0.75) 0 3px 10px",
    width: `${position.width + 119.5}px`,
    // height: `${position.height + 220}px`
  };

  if (updatedProfile.profileRatings) {
    for (let ratingObj of updatedProfile.profileRatings) {
      const { rating, movie: movieObj } = ratingObj;
      if (movieObj.movieId === movie.movieId) {
        if (rating === "like") {
          liked = true;
        } else if (rating === "dislike") {
          disliked = true;
        } else if (rating === "superlike") {
          superLiked = true;
        }
      }
    }
  }

  if (updatedProfile.watchLaterMovies) {
    for (let watchMovie of updatedProfile.watchLaterMovies) {
      if (watchMovie.movieId === movie.movieId) watchLater = true;
    }
  }

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };


  const handleRating = async (rating, movie) => {
    const newRating = {
      date: formatDate(new Date()),
      rating: rating,
      movie: movie,
    }

    const existingRating = updatedProfile.profileRatings.find(existingMovieRating =>
        existingMovieRating.movie.movieId === movie.movieId
    );

    const updatedRating ={
      ...existingRating,
      date: formatDate(new Date()),
      rating: rating,
    }

    if (existingRating && rating === existingRating.rating) {
      await dispatch(deleteMovieRating(existingRating, profile.profileId));
      updateProfile(updatedProfile);
      setSuperLiked(false);
      setLiked(false);
      setDisliked(false);
    } else if (existingRating) {
      await dispatch(updateMovieRating(profile, updatedRating));
      updateProfile(updatedProfile);
      setSuperLiked(rating === "superlike");
      setLiked(rating === "like");
      setDisliked(rating === "dislike");
    } else {
      await dispatch(createMovieRating(profile, newRating));
      updateProfile(updatedProfile);
      setSuperLiked(rating === "superlike");
      setLiked(rating === "like");
      setDisliked(rating === "dislike");
    }

  }

  const handleViewed = async (movie) => {
    const newView = {
      date: formatDate(new Date()),
      watched: true,
      movie: movie,
    }

    const existingView = updatedProfile.viewedMovies.find(existingViewedMovie =>
        existingViewedMovie.movie.movieId === movie.movieId
    );

    const updatedViewed ={
      ...existingView,
      date: formatDate(new Date()),
    }

    if (existingView) {
      await dispatch(updateViewedMovie(profile, updatedViewed));
      updateProfile(updatedProfile);
    } else {
      await dispatch(createViewedMovie(profile, newView));
      updateProfile(updatedProfile);
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
    } else if (superLiked) {
      return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg"
               className="default-ltr-cache-4z3qvp e1svuwfo1 active"
               data-name="ThumbsUpTwoFill" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M17.313 2.50407L17.407 3.25579C17.4688 3.75001 17.4688 4.24999 17.407 4.74421L17.125 7H21.5C22.3284 7 23 7.67157 23 8.5C23 9.02174 22.7336 9.48127 22.3295 9.75H22.5C23.3284 9.75 24 10.4216 24 11.25C24 11.9804 23.478 12.5888 22.7867 12.7226C23.2148 12.9868 23.5 13.4601 23.5 14C23.5 14.8284 22.8284 15.5 22 15.5H21.6181C21.8556 15.7654 22 16.1158 22 16.5C22 17.3284 21.3284 18 20.5 18H20H17.9195C17.9722 17.7585 18 17.5075 18 17.25C18 16.2903 17.6138 15.4209 16.9883 14.7886C16.996 14.6934 17 14.5972 17 14.5C17 12.567 15.433 11 13.5 11H11.3906L11.3915 10.9923C11.4739 10.3333 11.4739 9.66668 11.3915 9.00772L11.2976 8.256L10.0645 8.41013L11.2976 8.256C11.2865 8.16745 11.2731 8.0797 11.2574 7.99281C11.519 7.83232 11.7422 7.61247 11.9074 7.34813L13.848 4.2432C13.9473 4.08427 14 3.90062 14 3.7132V0.47644C14 0.21331 14.2133 0 14.4764 0C15.9181 0 17.1342 1.07353 17.313 2.50407ZM9.31301 8.50407L9.40697 9.25579C9.46875 9.75001 9.46875 10.25 9.40697 10.7442L9.125 13H13.5C14.3284 13 15 13.6716 15 14.5C15 15.0217 14.7336 15.4813 14.3294 15.75H14.5C15.3284 15.75 16 16.4216 16 17.25C16 17.9804 15.478 18.5888 14.7867 18.7226C15.2147 18.9868 15.5 19.4601 15.5 20C15.5 20.8284 14.8284 21.5 14 21.5H13.6181C13.8556 21.7654 14 22.1158 14 22.5C14 23.3284 13.3284 24 12.5 24H12H9H8.01556C6.69475 24 5.39679 23.6553 4.25 23L4.07684 22.9011C3.04352 22.3106 1.874 22 0.683874 22C0.306181 22 0 21.6938 0 21.3161V15.7543C0 15.3078 0.295977 14.9154 0.725279 14.7928L2.76086 14.2112C3.23665 14.0752 3.64516 13.7677 3.90742 13.3481L5.848 10.2432C5.94733 10.0843 6 9.90062 6 9.7132V6.47644C6 6.21331 6.21331 6 6.47644 6C7.91812 6 9.13419 7.07353 9.31301 8.50407Z"
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
      <div style={modalStyle} onMouseLeave={onMouseLeave} className="previewModal--container mini-modal has-smaller-buttons">
        <div className="previewModal--player_container mini-modal has-smaller-buttons">
          <div style={{position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
            <div style={{position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
              {/*<video*/}
              {/*    src={movie?.trailer}*/}
              {/*    autoPlay*/}
              {/*    playsInline={true}*/}
              {/*    ref={videoRef}*/}
              {/*    // muted*/}
              {/*    style={{position: "relative", width: "100%", height: "100%", objectFit: "cover"}}*/}
              {/*/>*/}
            </div>
          </div>
          <div className="videoMerchPlayer--boxart-wrapper" style={{position: "static"}}>
            <img className="previewModal--boxart" src={movie?.backdrop} alt={movie?.title} style={{opacity: 1}}/>
            {/*<img alt={movie?.title} src={movie?.backdrop} style={{display: "none"}}/>*/}
            <img className="previewModal--boxart" src={movie?.backdrop} alt={movie?.title} style={{opacity: 1}}/>
          </div>
          <div style={{opacity: 1}}>
            <div className="previewModal--player-titleTreatmentWrapper" style={{opacity: 1}}>
              <div className="previewModal--player-titleTreatment-left previewModal--player-titleTreatment mini-modal has-smaller-buttons mini-modal has-smaller-buttons" style={{left: "1.5em", width: "32%"}}>
                {/*<h1 className="previewModal--player-titleTreatment-logo" style={{width: "100%", opacity: 1, fontSize: "1em", fontWeight: 400, alignItems: "center", display: "flex"}}>{movie.title}</h1>*/}
                <img className="previewModal--player-titleTreatment-logo" alt="" src={movie.titleImage} style={{width: "100%", opacity: 1}}/>
              </div>
              <div className="mini-modal has-smaller-buttons previewModal-audioToggle" style={{opacity: 0.4, display: "block"}}>
                <div className="global-supplemental-audio-toggle">
                  <button className="color-supplementary hasIcon round ltr-11vo9g5" onClick={handleToggleMute}>
                    <div className="ltr-1st24vv">
                      <div className="small ltr-iyulz3">
                        {isMuted ?
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className="ltr-4z3qvp e1svuwfo1" data-name="VolumeOff" aria-hidden="true">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z"
                                fill="currentColor">
                          </path>
                        </svg>
                        :
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className="ltr-4z3qvp e1svuwfo1" data-name="VolumeHigh" aria-hidden="true">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M24 12C24 8.28693 22.525 4.72597 19.8995 2.10046L18.4853 3.51468C20.7357 5.76511 22 8.81736 22 12C22 15.1826 20.7357 18.2348 18.4853 20.4852L19.8995 21.8995C22.525 19.2739 24 15.713 24 12ZM11 3.99995C11 3.59549 10.7564 3.23085 10.3827 3.07607C10.009 2.92129 9.57889 3.00685 9.29289 3.29285L4.58579 7.99995H1C0.447715 7.99995 0 8.44767 0 8.99995V15C0 15.5522 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0786 10.3827 20.9238C10.7564 20.7691 11 20.4044 11 20V3.99995ZM5.70711 9.70706L9 6.41417V17.5857L5.70711 14.2928L5.41421 14H5H2V9.99995H5H5.41421L5.70711 9.70706ZM16.0001 12C16.0001 10.4087 15.368 8.88254 14.2428 7.75732L12.8285 9.17154C13.5787 9.92168 14.0001 10.9391 14.0001 12C14.0001 13.0608 13.5787 14.0782 12.8285 14.8284L14.2428 16.2426C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92889C18.9462 6.80426 19.9998 9.3478 19.9998 12C19.9998 14.6521 18.9462 17.1957 17.0709 19.071L15.6567 17.6568C17.157 16.1565 17.9998 14.1217 17.9998 12C17.9998 9.87823 17.157 7.8434 15.6567 6.34311L17.0709 4.92889Z"
                                fill="currentColor"></path>
                        </svg>
                        }
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="previewModal--info" style={{opacity: 1, transform: "none"}}>
          <a>
            <div className="mini-modal-container">
              <div className="previewModal--info-container ltr-xqhbvx">
                <div className="previewModal--metadatAndControls mini-modal has-smaller-buttons">
                  <div className="previewModal--metadatAndControls-container">
                    <div className="buttonControls--container mini-modal has-smaller-buttons">
                      <NavLink exact to={`/watch/${movie.movieId}`} onClick={() => closeMiniModal()} className="primary-button playLink isToolkit isRound">
                        <button className="color-primary hasIcon round ltr-jewi6s" onClick={() => handleViewed(movie)}>
                          <div className="ltr-1st24vv">
                            <div className="small ltr-iyulz3">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                   xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1" data-name="Play">
                                <path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                                    fill="currentColor">
                                </path>
                              </svg>
                            </div>
                          </div>
                        </button>
                      </NavLink>
                      <div className="ltr-bjn8wh">
                        <div className="ptrack-content">
                          <button className="color-supplementary hasIcon round ltr-11vo9g5" onClick={() => handleWatchLaterMovie(movie)}>
                            <div className="ltr-1st24vv">
                              <div className="small ltr-iyulz3">
                                {watchLater ?
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg"
                                         className="ltr-4z3qvp e1svuwfo1" data-name="Checkmark" aria-hidden="true">
                                      <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                          fill="currentColor">
                                    </path>
                                  </svg>
                                    :
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                         className="ltr-4z3qvp e1svuwfo1" data-name="Plus" aria-hidden="true">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
                                            fill="currentColor">
                                      </path>
                                    </svg>
                                }
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                      <div className="ltr-179t5g5">
                        <button className="color-supplementary hasIcon round ltr-126oqy" onMouseEnter={openMenu}>
                          <div className="ltr-1st24vv">
                            <div className="small ltr-iyulz3">
                              {renderLikedStatus()}
                            </div>
                          </div>
                        </button>
                        <div className={`thumbs-selection-overlay-container ltr-1f3e9vp ${showLikeMenu ? 'visible' : ''}`}
                             style={{opacity: 1, transform: "translateX(-50%) translateY(-50%) scale(1) translateZ(0px)"}} ref={likedRef} onMouseLeave={closeMenu}>
                          <div id="thumbs-selection-menu">
                            <div>
                              <div className="ltr-73ot9c">
                                <div className="ltr-bjn8wh">
                                  <div style={{opacity: 1, transform: "none"}}>
                                    <button className="color-supplementary small round ltr-8h50qn" id="thumbs-selection-down"
                                            onClick={() => handleRating("dislike", movie)}>
                                      {disliked ?
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72"
                                               style={{width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)"}} preserveAspectRatio="xMidYMid meet">
                                            <defs>
                                              <clipPath id="__lottie_element_659">
                                                <rect width="72" height="72" x="0" y="0"></rect>
                                              </clipPath>
                                              <clipPath id="__lottie_element_661">
                                                <path d="M0,0 L31,0 L31,31 L0,31z"></path>
                                              </clipPath>
                                            </defs>
                                            <g clip-path="url(#__lottie_element_659)">
                                              <g clip-path="url(#__lottie_element_661)" style={{display: "block"}} transform="matrix(1,0,0,1,18.875,20.5)" opacity="1">
                                                <g style={{display: "block"}} transform="matrix(26,0,0,26,16.060998916625977,16.01300048828125)" opacity="1">
                                                  <g opacity="1" transform="matrix(0.0384100005030632,0,0,0.0384100005030632,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1"
                                                          d=" M-1.312999963760376,6.495999813079834 C-1.312999963760376,6.495999813079834 -1.406999945640564,5.74399995803833 -1.406999945640564,5.74399995803833 C-1.468999981880188,5.25 -1.468999981880188,4.75 -1.406999945640564,4.25600004196167 C-1.406999945640564,4.25600004196167 -1.125,2 -1.125,2 C-1.125,2 -5.5,2 -5.5,2 C-6.328000068664551,2 -7,1.3279999494552612 -7,0.5 C-7,-0.02199999988079071 -6.732999801635742,-0.48100000619888306 -6.328999996185303,-0.75 C-6.328999996185303,-0.75 -6.5,-0.75 -6.5,-0.75 C-7.328000068664551,-0.75 -8,-1.4220000505447388 -8,-2.25 C-8,-2.9800000190734863 -7.478000164031982,-3.5889999866485596 -6.7870001792907715,-3.7230000495910645 C-7.215000152587891,-3.986999988555908 -7.5,-4.460000038146973 -7.5,-5 C-7.5,-5.828000068664551 -6.828000068664551,-6.5 -6,-6.5 C-6,-6.5 -5.618000030517578,-6.5 -5.618000030517578,-6.5 C-5.855999946594238,-6.764999866485596 -6,-7.116000175476074 -6,-7.5 C-6,-8.32800006866455 -5.328000068664551,-9 -4.5,-9 C-4.5,-9 -0.01600000075995922,-9 -0.01600000075995922,-9 C1.3049999475479126,-9 2.6029999256134033,-8.654999732971191 3.75,-8 C3.75,-8 3.9230000972747803,-7.901000022888184 3.9230000972747803,-7.901000022888184 C4.955999851226807,-7.310999870300293 6.125999927520752,-7 7.315999984741211,-7 C7.693999767303467,-7 8,-6.693999767303467 8,-6.315999984741211 C8,-6.315999984741211 8,-0.7540000081062317 8,-0.7540000081062317 C8,-0.30799999833106995 7.703999996185303,0.08399999886751175 7.275000095367432,0.2070000022649765 C7.275000095367432,0.2070000022649765 5.238999843597412,0.7889999747276306 5.238999843597412,0.7889999747276306 C4.763000011444092,0.925000011920929 4.355000019073486,1.2319999933242798 4.0929999351501465,1.6519999504089355 C4.0929999351501465,1.6519999504089355 2.1519999504089355,4.756999969482422 2.1519999504089355,4.756999969482422 C2.052999973297119,4.915999889373779 2,5.099999904632568 2,5.2870001792907715 C2,5.2870001792907715 2,8.52400016784668 2,8.52400016784668 C2,8.786999702453613 1.7869999408721924,9 1.5240000486373901,9 C0.0820000022649765,9 -1.1339999437332153,7.927000045776367 -1.312999963760376,6.495999813079834z"></path>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </svg>
                                          :
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72" style={{width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)"}} preserveAspectRatio="xMidYMid meet">
                                        <defs>
                                          <clipPath id="__lottie_element_591">
                                            <rect width="72" height="72" x="0" y="0"></rect>
                                          </clipPath>
                                          <clipPath id="__lottie_element_593">
                                            <path d="M0,0 L31,0 L31,31 L0,31z"></path>
                                          </clipPath>
                                        </defs>
                                        <g clip-path="url(#__lottie_element_591)">
                                          <g clip-path="url(#__lottie_element_593)" style={{display: "block"}} transform="matrix(1,0,0,1,18.875,20.5)" opacity="1">
                                            <g style={{display: "block"}} transform="matrix(0.49998003244400024,0,0,0.49998003244400024,16.243000030517578,16)" opacity="1">
                                              <g opacity="1" transform="matrix(2,0,0,2,0,0)">
                                                <path fill="rgb(255,255,255)" fill-opacity="1"
                                                      d=" M1.25,4.2870001792907715 C1.25,3.9119999408721924 1.3550000190734863,3.5450000762939453 1.5540000200271606,3.2269999980926514 C1.5540000200271606,3.2269999980926514 3.494999885559082,0.12200000137090683 3.494999885559082,0.12200000137090683 C3.888000011444092,-0.5070000290870667 4.5,-0.968999981880188 5.214000225067139,-1.1729999780654907 C5.214000225067139,-1.1729999780654907 7.25,-1.753999948501587 7.25,-1.753999948501587 C7.25,-1.753999948501587 7.25,-6.5 7.25,-6.5 C6.133999824523926,-6.505000114440918 5.025000095367432,-6.686999797821045 3.9660000801086426,-7.039999961853027 C3.9660000801086426,-7.039999961853027 2.4730000495910645,-7.538000106811523 2.4730000495910645,-7.538000106811523 C1.5549999475479126,-7.843999862670898 0.593999981880188,-8 -0.37299999594688416,-8 C-0.37299999594688416,-8 -4.25,-8 -4.25,-8 C-5.078000068664551,-8 -5.75,-7.328000068664551 -5.75,-6.5 C-5.75,-6.5 -5.75,-6.000999927520752 -5.75,-6.000999927520752 C-5.75,-6.000999927520752 -6.14900016784668,-5.701000213623047 -6.14900016784668,-5.701000213623047 C-6.515999794006348,-5.426000118255615 -6.75,-4.989999771118164 -6.75,-4.5 C-6.75,-4.4070000648498535 -6.742000102996826,-4.316999912261963 -6.72599983215332,-4.230000019073486 C-6.72599983215332,-4.230000019073486 -6.644999980926514,-3.7850000858306885 -6.644999980926514,-3.7850000858306885 C-6.644999980926514,-3.7850000858306885 -6.926000118255615,-3.430999994277954 -6.926000118255615,-3.430999994277954 C-7.129000186920166,-3.174999952316284 -7.25,-2.8529999256134033 -7.25,-2.5 C-7.25,-2.1470000743865967 -7.129000186920166,-1.8250000476837158 -6.926000118255615,-1.569000005722046 C-6.926000118255615,-1.569000005722046 -6.644999980926514,-1.215000033378601 -6.644999980926514,-1.215000033378601 C-6.644999980926514,-1.215000033378601 -6.72599983215332,-0.7699999809265137 -6.72599983215332,-0.7699999809265137 C-6.742000102996826,-0.6830000281333923 -6.75,-0.5929999947547913 -6.75,-0.5 C-6.75,0.328000009059906 -6.078000068664551,1 -5.25,1 C-5.25,1 -1.180999994277954,1 -1.180999994277954,1 C-1.180999994277954,1 -1.503999948501587,2.25 -1.503999948501587,2.25 C-1.6480000019073486,2.808000087738037 -1.75,3.4149999618530273 -1.75,4 C-1.75,4.7729997634887695 -1.5729999542236328,5.7729997634887695 -1.3569999933242798,6.689000129699707 C-1.1779999732971191,7.447000026702881 -0.4650000035762787,8 0.41200000047683716,8 C0.41200000047683716,8 1.25,8 1.25,8 C1.25,8 1.25,4.2870001792907715 1.25,4.2870001792907715z M3.25,8.5 C3.25,9.32800006866455 2.578000068664551,10 1.75,10 C1.75,10 0.41200000047683716,10 0.41200000047683716,10 C-1.2929999828338623,10 -2.890000104904175,8.902999877929688 -3.303999900817871,7.1479997634887695 C-3.5290000438690186,6.193999767303467 -3.75,5.011000156402588 -3.75,4 C-3.75,3.6600000858306885 -3.7249999046325684,3.3239998817443848 -3.684000015258789,3 C-3.684000015258789,3 -5.25,3 -5.25,3 C-7.183000087738037,3 -8.75,1.4329999685287476 -8.75,-0.5 C-8.75,-0.5630000233650208 -8.748000144958496,-0.6259999871253967 -8.744999885559082,-0.6880000233650208 C-9.0649995803833,-1.2170000076293945 -9.25,-1.8380000591278076 -9.25,-2.5 C-9.25,-3.1619999408721924 -9.0649995803833,-3.7829999923706055 -8.744999885559082,-4.311999797821045 C-8.748000144958496,-4.374000072479248 -8.75,-4.436999797821045 -8.75,-4.5 C-8.75,-5.4710001945495605 -8.354000091552734,-6.349999904632568 -7.7170000076293945,-6.982999801635742 C-7.48199987411499,-8.687999725341797 -6.019000053405762,-10 -4.25,-10 C-4.25,-10 -0.37299999594688416,-10 -0.37299999594688416,-10 C0.8090000152587891,-10 1.9839999675750732,-9.8100004196167 3.1059999465942383,-9.435999870300293 C3.1059999465942383,-9.435999870300293 4.598999977111816,-8.937999725341797 4.598999977111816,-8.937999725341797 C5.468999862670898,-8.64799976348877 6.380000114440918,-8.5 7.296999931335449,-8.5 C8.37600040435791,-8.5 9.25,-7.625999927520752 9.25,-6.546999931335449 C9.25,-6.546999931335449 9.25,-1.753999948501587 9.25,-1.753999948501587 C9.25,-0.8610000014305115 8.657999992370605,-0.07599999755620956 7.798999786376953,0.16899999976158142 C7.798999786376953,0.16899999976158142 5.763999938964844,0.75 5.763999938964844,0.75 C5.526000022888184,0.8180000185966492 5.322000026702881,0.972000002861023 5.190999984741211,1.1820000410079956 C5.190999984741211,1.1820000410079956 3.25,4.2870001792907715 3.25,4.2870001792907715 C3.25,4.2870001792907715 3.25,8.5 3.25,8.5z"></path>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </svg>
                                      }
                                    </button>
                                  </div>
                                </div>
                                <div className="ltr-bjn8wh">
                                  <button className="color-supplemental small round ltr-x5tqf7" id="thumbs-selection-up" onClick={() => handleRating("like", movie)}>
                                    {liked ?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72" style={{width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)"}} preserveAspectRatio="xMidYMid meet">
                                          <defs>
                                            <clipPath id="__lottie_element_467">
                                              <rect width="72" height="72" x="0" y="0"></rect>
                                            </clipPath>
                                            <clipPath id="__lottie_element_469">
                                              <path d="M0,0 L31,0 L31,31 L0,31z"></path>
                                            </clipPath>
                                          </defs>
                                          <g clip-path="url(#__lottie_element_467)">
                                            <g clip-path="url(#__lottie_element_469)" style={{display: "block"}} transform="matrix(1,0,0,1,19.625,20.5)" opacity="1">
                                              <g style={{display: "block"}} transform="matrix(1,0,0,1,15.71399974822998,15.83899974822998)" opacity="1">
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                  <path fill="rgb(255,255,255)" fill-opacity="1"
                                                        d=" M1.312999963760376,-6.495999813079834 C1.312999963760376,-6.495999813079834 1.406999945640564,-5.74399995803833 1.406999945640564,-5.74399995803833 C1.468999981880188,-5.25 1.468999981880188,-4.75 1.406999945640564,-4.25600004196167 C1.406999945640564,-4.25600004196167 1.125,-2 1.125,-2 C1.125,-2 5.5,-2 5.5,-2 C6.328000068664551,-2 7,-1.3279999494552612 7,-0.5 C7,0.02199999988079071 6.732999801635742,0.48100000619888306 6.328999996185303,0.75 C6.328999996185303,0.75 6.5,0.75 6.5,0.75 C7.328000068664551,0.75 8,1.4220000505447388 8,2.25 C8,2.9800000190734863 7.478000164031982,3.5889999866485596 6.7870001792907715,3.7230000495910645 C7.215000152587891,3.986999988555908 7.5,4.460000038146973 7.5,5 C7.5,5.828000068664551 6.828000068664551,6.5 6,6.5 C6,6.5 5.618000030517578,6.5 5.618000030517578,6.5 C5.855999946594238,6.764999866485596 6,7.116000175476074 6,7.5 C6,8.32800006866455 5.328000068664551,9 4.5,9 C4.5,9 0.01600000075995922,9 0.01600000075995922,9 C-1.3049999475479126,9 -2.6029999256134033,8.654999732971191 -3.75,8 C-3.75,8 -3.9230000972747803,7.901000022888184 -3.9230000972747803,7.901000022888184 C-4.955999851226807,7.310999870300293 -6.125999927520752,7 -7.315999984741211,7 C-7.693999767303467,7 -8,6.693999767303467 -8,6.315999984741211 C-8,6.315999984741211 -8,0.7540000081062317 -8,0.7540000081062317 C-8,0.30799999833106995 -7.703999996185303,-0.08399999886751175 -7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -5.238999843597412,-0.7889999747276306 -5.238999843597412,-0.7889999747276306 C-4.763000011444092,-0.925000011920929 -4.355000019073486,-1.2319999933242798 -4.0929999351501465,-1.6519999504089355 C-4.0929999351501465,-1.6519999504089355 -2.1519999504089355,-4.756999969482422 -2.1519999504089355,-4.756999969482422 C-2.052999973297119,-4.915999889373779 -2,-5.099999904632568 -2,-5.2870001792907715 C-2,-5.2870001792907715 -2,-8.52400016784668 -2,-8.52400016784668 C-2,-8.786999702453613 -1.7869999408721924,-9 -1.5240000486373901,-9 C-0.0820000022649765,-9 1.1339999437332153,-7.927000045776367 1.312999963760376,-6.495999813079834z"></path>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        :
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72" style={{width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)"}} preserveAspectRatio="xMidYMid meet">
                                      <defs>
                                        <clipPath id="__lottie_element_603">
                                          <rect width="72" height="72" x="0" y="0"></rect>
                                        </clipPath>
                                        <clipPath id="__lottie_element_605">
                                          <path d="M0,0 L31,0 L31,31 L0,31z"></path>
                                        </clipPath>
                                      </defs>
                                      <g clip-path="url(#__lottie_element_603)">
                                        <g clip-path="url(#__lottie_element_605)" style={{display: "block"}} transform="matrix(1,0,0,1,19.625,20.5)" opacity="1">
                                          <g style={{display: "block"}} transform="matrix(1,0,0,1,27.74799919128418,16.035999298095703)" opacity="1">
                                            <g opacity="1" transform="matrix(1,0,0,1,0,0)"></g>
                                            <g opacity="1" transform="matrix(1,0,0,1,-11.97599983215332,-0.03400000184774399)">
                                              <path fill="rgb(255,255,255)" fill-opacity="1"
                                                    d=" M-1.25,-4.2870001792907715 C-1.25,-3.9119999408721924 -1.3550000190734863,-3.5450000762939453 -1.5540000200271606,-3.2269999980926514 C-1.5540000200271606,-3.2269999980926514 -3.494999885559082,-0.12200000137090683 -3.494999885559082,-0.12200000137090683 C-3.888000011444092,0.5070000290870667 -4.5,0.968999981880188 -5.214000225067139,1.1729999780654907 C-5.214000225067139,1.1729999780654907 -7.25,1.753999948501587 -7.25,1.753999948501587 C-7.25,1.753999948501587 -7.25,6.5 -7.25,6.5 C-6.133999824523926,6.505000114440918 -5.025000095367432,6.686999797821045 -3.9660000801086426,7.039999961853027 C-3.9660000801086426,7.039999961853027 -2.4730000495910645,7.538000106811523 -2.4730000495910645,7.538000106811523 C-1.5549999475479126,7.843999862670898 -0.593999981880188,8 0.37299999594688416,8 C0.37299999594688416,8 4.25,8 4.25,8 C5.078000068664551,8 5.75,7.328000068664551 5.75,6.5 C5.75,6.5 5.75,6.000999927520752 5.75,6.000999927520752 C5.75,6.000999927520752 6.14900016784668,5.701000213623047 6.14900016784668,5.701000213623047 C6.515999794006348,5.426000118255615 6.75,4.989999771118164 6.75,4.5 C6.75,4.4070000648498535 6.742000102996826,4.316999912261963 6.72599983215332,4.230000019073486 C6.72599983215332,4.230000019073486 6.644999980926514,3.7850000858306885 6.644999980926514,3.7850000858306885 C6.644999980926514,3.7850000858306885 6.926000118255615,3.430999994277954 6.926000118255615,3.430999994277954 C7.129000186920166,3.174999952316284 7.25,2.8529999256134033 7.25,2.5 C7.25,2.1470000743865967 7.129000186920166,1.8250000476837158 6.926000118255615,1.569000005722046 C6.926000118255615,1.569000005722046 6.644999980926514,1.215000033378601 6.644999980926514,1.215000033378601 C6.644999980926514,1.215000033378601 6.72599983215332,0.7699999809265137 6.72599983215332,0.7699999809265137 C6.742000102996826,0.6830000281333923 6.75,0.5929999947547913 6.75,0.5 C6.75,-0.328000009059906 6.078000068664551,-1 5.25,-1 C5.25,-1 1.180999994277954,-1 1.180999994277954,-1 C1.180999994277954,-1 1.503999948501587,-2.25 1.503999948501587,-2.25 C1.6480000019073486,-2.808000087738037 1.75,-3.4149999618530273 1.75,-4 C1.75,-4.7729997634887695 1.5729999542236328,-5.7729997634887695 1.3569999933242798,-6.689000129699707 C1.1779999732971191,-7.447000026702881 0.4650000035762787,-8 -0.41200000047683716,-8 C-0.41200000047683716,-8 -1.25,-8 -1.25,-8 C-1.25,-8 -1.25,-4.2870001792907715 -1.25,-4.2870001792907715z M-3.25,-8.5 C-3.25,-9.32800006866455 -2.578000068664551,-10 -1.75,-10 C-1.75,-10 -0.41200000047683716,-10 -0.41200000047683716,-10 C1.2929999828338623,-10 2.890000104904175,-8.902999877929688 3.303999900817871,-7.1479997634887695 C3.5290000438690186,-6.193999767303467 3.75,-5.011000156402588 3.75,-4 C3.75,-3.6600000858306885 3.7249999046325684,-3.3239998817443848 3.684000015258789,-3 C3.684000015258789,-3 5.25,-3 5.25,-3 C7.183000087738037,-3 8.75,-1.4329999685287476 8.75,0.5 C8.75,0.5630000233650208 8.748000144958496,0.6259999871253967 8.744999885559082,0.6880000233650208 C9.0649995803833,1.2170000076293945 9.25,1.8380000591278076 9.25,2.5 C9.25,3.1619999408721924 9.0649995803833,3.7829999923706055 8.744999885559082,4.311999797821045 C8.748000144958496,4.374000072479248 8.75,4.436999797821045 8.75,4.5 C8.75,5.4710001945495605 8.354000091552734,6.349999904632568 7.7170000076293945,6.982999801635742 C7.48199987411499,8.687999725341797 6.019000053405762,10 4.25,10 C4.25,10 0.37299999594688416,10 0.37299999594688416,10 C-0.8090000152587891,10 -1.9839999675750732,9.8100004196167 -3.1059999465942383,9.435999870300293 C-3.1059999465942383,9.435999870300293 -4.598999977111816,8.937999725341797 -4.598999977111816,8.937999725341797 C-5.468999862670898,8.64799976348877 -6.380000114440918,8.5 -7.296999931335449,8.5 C-8.37600040435791,8.5 -9.25,7.625999927520752 -9.25,6.546999931335449 C-9.25,6.546999931335449 -9.25,1.753999948501587 -9.25,1.753999948501587 C-9.25,0.8610000014305115 -8.657999992370605,0.07599999755620956 -7.798999786376953,-0.16899999976158142 C-7.798999786376953,-0.16899999976158142 -5.763999938964844,-0.75 -5.763999938964844,-0.75 C-5.526000022888184,-0.8180000185966492 -5.322000026702881,-0.972000002861023 -5.190999984741211,-1.1820000410079956 C-5.190999984741211,-1.1820000410079956 -3.25,-4.2870001792907715 -3.25,-4.2870001792907715 C-3.25,-4.2870001792907715 -3.25,-8.5 -3.25,-8.5z"></path>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </svg>
                                    }
                                  </button>
                                </div>
                                <div className="ltr-bjn8wh">
                                  <div style={{opacity: 1, transform: "none"}}>
                                    <button className="color-supplemental small round ltr-8h50qn" onClick={() => handleRating("superlike", movie)}>
                                      {superLiked ?
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72" style={{width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)"}} preserveAspectRatio="xMidYMid meet">
                                            <defs>
                                              <clipPath id="__lottie_element_274">
                                                <rect width="72" height="72" x="0" y="0"></rect>
                                              </clipPath>
                                              <clipPath id="__lottie_element_276">
                                                <path d="M0,0 L410,0 L410,410 L0,410z"></path>
                                              </clipPath>
                                              <filter id="__lottie_element_293" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                                                <feComponentTransfer in="SourceGraphic">
                                                  <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
                                                </feComponentTransfer>
                                              </filter>
                                              <mask id="__lottie_element_292" mask-type="alpha">
                                                <g filter="url(#__lottie_element_293)">
                                                  <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
                                                  <g style={{display: "block"}} transform="matrix(1,0,0,1,31.5,37.03200149536133)" opacity="1">
                                                    <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                      <path fill="rgb(63,84,255)" fill-opacity="1"
                                                          d=" M7.400000095367432,5.539999961853027 C7.388999938964844,5.567999839782715 7.376999855041504,5.59499979019165 7.364999771118164,5.622000217437744 M-7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -7.823999881744385,-2.130000114440918 -7.823999881744385,-2.130000114440918 M-3.75,8 C-3.75,8 -4.742000102996826,9.736000061035156 -4.742000102996826,9.736000061035156 M-4.742000102996826,9.736000061035156 C-4.742000102996826,9.736000061035156 -4.914999961853027,9.637999534606934 -4.914999961853027,9.637999534606934 C-5.645999908447266,9.220000267028809 -6.473999977111816,9 -7.315999984741211,9 C-8.79800033569336,9 -10,7.797999858856201 -10,6.315999984741211 C-10,6.315999984741211 -10,0.7540000081062317 -10,0.7540000081062317 C-10,-0.5849999785423279 -9.112000465393066,-1.7619999647140503 -7.823999881744385,-2.130000114440918 C-7.823999881744385,-2.130000114440918 -5.789000034332275,-2.7119998931884766 -5.789000034332275,-2.7119998931884766 C-5.789000034332275,-2.7119998931884766 -4,-5.573999881744385 -4,-5.573999881744385 C-4,-5.573999881744385 -4,-8.52400016784668 -4,-8.52400016784668 C-4,-9.892000198364258 -2.8919999599456787,-11 -1.5240000486373901,-11 C0.9259999990463257,-11 2.99399995803833,-9.175000190734863 3.2980000972747803,-6.74399995803833 C3.2980000972747803,-6.74399995803833 3.375999927520752,-6.116000175476074 3.375999927520752,-6.116000175476074 C3.4639999866485596,-5.413000106811523 3.4579999446868896,-4.701000213623047 3.3589999675750732,-4 C3.3589999675750732,-4 5.5,-4 5.5,-4 C7.433000087738037,-4 9,-2.433000087738037 9,-0.5 C9,-0.40299999713897705 8.996000289916992,-0.3059999942779541 8.98799991607666,-0.210999995470047 C9.61400032043457,0.42100000381469727 10,1.2899999618530273 10,2.25 C10,2.9719998836517334 9.781999588012695,3.6419999599456787 9.407999992370605,4.198999881744385 C9.468000411987305,4.455999851226807 9.5,4.723999977111816 9.5,5 C9.5,6.198999881744385 8.89799976348877,7.25600004196167 7.979000091552734,7.88700008392334 C7.785999774932861,9.637999534606934 6.302000045776367,11 4.5,11 C4.5,11 0.01600000075995922,11 0.01600000075995922,11 C-1.652999997138977,11 -3.2929999828338623,10.564000129699707 -4.742000102996826,9.736000061035156z"></path>
                                                    </g>
                                                  </g>
                                                </g>
                                              </mask>
                                              <filter id="__lottie_element_300" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                                                <feComponentTransfer in="SourceGraphic">
                                                  <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
                                                </feComponentTransfer>
                                              </filter>
                                              <mask id="__lottie_element_299" mask-type="alpha">
                                                <g filter="url(#__lottie_element_300)">
                                                  <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
                                                  <g style={{display: "block"}} transform="matrix(0.6000000238418579,0,0,0.6000000238418579,32.3120002746582,37.56879806518555)" opacity="1">
                                                    <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                      <path fill="rgb(63,84,255)" fill-opacity="1"
                                                            d=" M-2.75,-12 C-2.75,-12 -1.4119999408721924,-12 -1.4119999408721924,-12 C1.121000051498413,-12 3.6019999980926514,-10.359000205993652 4.250999927520752,-7.60699987411499 C4.423999786376953,-6.870999813079834 4.614999771118164,-5.929999828338623 4.702000141143799,-4.98199987411499 C7.426000118255615,-4.760000228881836 9.588000297546387,-2.553999900817871 9.741000175476074,0.1889999955892563 C10.067000389099121,0.8930000066757202 10.25,1.6770000457763672 10.25,2.5 C10.25,3.3239998817443848 10.067000389099121,4.10699987411499 9.741000175476074,4.810999870300293 C9.675999641418457,5.9770002365112305 9.246999740600586,7.046000003814697 8.569000244140625,7.90500020980835 C7.947999954223633,10.26200008392334 5.802000045776367,12 3.25,12 C3.25,12 -0.34599998593330383,12 -0.34599998593330383,12 C-2.007999897003174,12 -3.6540000438690186,11.661999702453613 -5.182000160217285,11.006999969482422 C-5.182000160217285,11.006999969482422 -6.005000114440918,10.654999732971191 -6.005000114440918,10.654999732971191 C-6.243000030517578,10.553000450134277 -6.5,10.5 -6.758999824523926,10.5 C-8.687000274658203,10.5 -10.25,8.937000274658203 -10.25,7.008999824523926 C-10.25,7.008999824523926 -10.25,1.6180000305175781 -10.25,1.6180000305175781 C-10.25,0.10300000011920929 -9.394000053405762,-1.281999945640564 -8.038999557495117,-1.9600000381469727 C-8.038999557495117,-1.9600000381469727 -7.486000061035156,-2.2360000610351562 -7.486000061035156,-2.2360000610351562 C-7.486000061035156,-2.2360000610351562 -6.25,-4.708000183105469 -6.25,-4.708000183105469 C-6.25,-4.708000183105469 -6.25,-8.5 -6.25,-8.5 C-6.25,-10.432999610900879 -4.683000087738037,-12 -2.75,-12z"></path>
                                                    </g>
                                                  </g>
                                                </g>
                                              </mask>
                                              <filter id="__lottie_element_307" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                                                <feComponentTransfer in="SourceGraphic">
                                                  <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
                                                </feComponentTransfer>
                                              </filter>
                                              <mask id="__lottie_element_306" mask-type="alpha">
                                                <g filter="url(#__lottie_element_307)">
                                                  <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
                                                </g>
                                              </mask>
                                              <filter id="__lottie_element_314" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                                                <feComponentTransfer in="SourceGraphic">
                                                  <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
                                                </feComponentTransfer>
                                              </filter>
                                              <mask id="__lottie_element_313" mask-type="alpha">
                                                <g filter="url(#__lottie_element_314)">
                                                  <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
                                                </g>
                                              </mask>
                                            </defs>
                                            <g clip-path="url(#__lottie_element_274)">
                                              <g style={{display: "block"}} mask="url(#__lottie_element_292)">
                                                <g transform="matrix(1,0,0,1,39.308998107910156,33.82899856567383)" opacity="1">
                                                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1"
                                                          d=" M1.312999963760376,-6.495999813079834 C1.312999963760376,-6.495999813079834 1.3919999599456787,-5.868000030517578 1.3919999599456787,-5.868000030517578 C1.4639999866485596,-5.291999816894531 1.4509999752044678,-4.709000110626221 1.3559999465942383,-4.13700008392334 C1.3559999465942383,-4.13700008392334 1,-2 1,-2 C1,-2 5.5,-2 5.5,-2 C6.328000068664551,-2 7,-1.3279999494552612 7,-0.5 C7,0.02199999988079071 6.732999801635742,0.48100000619888306 6.328999996185303,0.75 C6.328999996185303,0.75 6.5,0.75 6.5,0.75 C7.328000068664551,0.75 8,1.4220000505447388 8,2.25 C8,2.9800000190734863 7.478000164031982,3.5889999866485596 6.7870001792907715,3.7230000495910645 C7.215000152587891,3.986999988555908 7.5,4.460000038146973 7.5,5 C7.5,5.828000068664551 6.828000068664551,6.5 6,6.5 C6,6.5 5.618000030517578,6.5 5.618000030517578,6.5 C5.855999946594238,6.764999866485596 6,7.116000175476074 6,7.5 C6,8.32800006866455 5.328000068664551,9 4.5,9 C4.5,9 0.01600000075995922,9 0.01600000075995922,9 C-1.3049999475479126,9 -2.6029999256134033,8.654999732971191 -3.75,8 C-3.75,8 -3.9230000972747803,7.901000022888184 -3.9230000972747803,7.901000022888184 C-4.955999851226807,7.310999870300293 -6.125999927520752,7 -7.315999984741211,7 C-7.693999767303467,7 -8,6.693999767303467 -8,6.315999984741211 C-8,6.315999984741211 -8,0.7540000081062317 -8,0.7540000081062317 C-8,0.30799999833106995 -7.703999996185303,-0.08399999886751175 -7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -5.238999843597412,-0.7889999747276306 -5.238999843597412,-0.7889999747276306 C-4.763000011444092,-0.925000011920929 -4.355000019073486,-1.2319999933242798 -4.0929999351501465,-1.6519999504089355 C-4.0929999351501465,-1.6519999504089355 -2.1519999504089355,-4.756999969482422 -2.1519999504089355,-4.756999969482422 C-2.052999973297119,-4.915999889373779 -2,-5.099999904632568 -2,-5.2870001792907715 C-2,-5.2870001792907715 -2,-8.52400016784668 -2,-8.52400016784668 C-2,-8.786999702453613 -1.7869999408721924,-9 -1.5240000486373901,-9 C-0.0820000022649765,-9 1.1339999437332153,-7.927000045776367 1.312999963760376,-6.495999813079834z"></path>
                                                  </g>
                                                </g>
                                              </g>
                                              <g style={{display: "block"}} transform="matrix(1,0,0,1,31.48900032043457,37.26300048828125)" opacity="1">
                                                <g opacity="1"
                                                   transform="matrix(1,0,0,1,0,0)">
                                                  <path fill="rgb(255,255,255)" fill-opacity="1"
                                                        d=" M1.312999963760376,-6.495999813079834 C1.312999963760376,-6.495999813079834 1.3919999599456787,-5.868000030517578 1.3919999599456787,-5.868000030517578 C1.4639999866485596,-5.291999816894531 1.4509999752044678,-4.709000110626221 1.3559999465942383,-4.13700008392334 C1.3559999465942383,-4.13700008392334 1,-2 1,-2 C1,-2 5.5,-2 5.5,-2 C6.328000068664551,-2 7,-1.3279999494552612 7,-0.5 C7,0.02199999988079071 6.732999801635742,0.48100000619888306 6.328999996185303,0.75 C6.328999996185303,0.75 6.5,0.75 6.5,0.75 C7.328000068664551,0.75 8,1.4220000505447388 8,2.25 C8,2.9800000190734863 7.478000164031982,3.5889999866485596 6.7870001792907715,3.7230000495910645 C7.215000152587891,3.986999988555908 7.5,4.460000038146973 7.5,5 C7.5,5.828000068664551 6.828000068664551,6.5 6,6.5 C6,6.5 5.618000030517578,6.5 5.618000030517578,6.5 C5.855999946594238,6.764999866485596 6,7.116000175476074 6,7.5 C6,8.32800006866455 5.328000068664551,9 4.5,9 C4.5,9 0.01600000075995922,9 0.01600000075995922,9 C-1.3049999475479126,9 -2.6029999256134033,8.654999732971191 -3.75,8 C-3.75,8 -3.9230000972747803,7.901000022888184 -3.9230000972747803,7.901000022888184 C-4.955999851226807,7.310999870300293 -6.125999927520752,7 -7.315999984741211,7 C-7.693999767303467,7 -8,6.693999767303467 -8,6.315999984741211 C-8,6.315999984741211 -8,0.7540000081062317 -8,0.7540000081062317 C-8,0.30799999833106995 -7.703999996185303,-0.08399999886751175 -7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -5.238999843597412,-0.7889999747276306 -5.238999843597412,-0.7889999747276306 C-4.763000011444092,-0.925000011920929 -4.355000019073486,-1.2319999933242798 -4.0929999351501465,-1.6519999504089355 C-4.0929999351501465,-1.6519999504089355 -2.1519999504089355,-4.756999969482422 -2.1519999504089355,-4.756999969482422 C-2.052999973297119,-4.915999889373779 -2,-5.099999904632568 -2,-5.2870001792907715 C-2,-5.2870001792907715 -2,-8.52400016784668 -2,-8.52400016784668 C-2,-8.786999702453613 -1.7869999408721924,-9 -1.5240000486373901,-9 C-0.0820000022649765,-9 1.1339999437332153,-7.927000045776367 1.312999963760376,-6.495999813079834z"></path>
                                                </g>
                                              </g>
                                              <g clip-path="url(#__lottie_element_276)" style={{display: "block"}} transform="matrix(0.15610000491142273,0,0,0.15610000491142273,3.249500274658203,-0.7504997253417969)" opacity="1">
                                              </g>
                                            </g>
                                          </svg>
                                          :
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72" style={{width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)"}} preserveAspectRatio="xMidYMid meet">
                                        <defs>
                                          <clipPath id="__lottie_element_546">
                                            <rect width="72" height="72" x="0" y="0">
                                            </rect>
                                          </clipPath>
                                          <clipPath id="__lottie_element_548">
                                            <path d="M0,0 L410,0 L410,410 L0,410z">
                                            </path>
                                          </clipPath>
                                          <filter id="__lottie_element_565" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                                            <feComponentTransfer in="SourceGraphic">
                                              <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
                                            </feComponentTransfer>
                                          </filter>
                                          <mask id="__lottie_element_564" mask-type="alpha">
                                            <g filter="url(#__lottie_element_565)">
                                              <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
                                              <g style={{display: "block"}} transform="matrix(1,0,0,1,31.5,37.03200149536133)" opacity="1">
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                  <path fill="rgb(63,84,255)" fill-opacity="1"
                                                        d=" M7.400000095367432,5.539999961853027 C7.388999938964844,5.567999839782715 7.376999855041504,5.59499979019165 7.364999771118164,5.622000217437744 M-7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -7.823999881744385,-2.130000114440918 -7.823999881744385,-2.130000114440918 M-3.75,8 C-3.75,8 -4.742000102996826,9.736000061035156 -4.742000102996826,9.736000061035156 M-4.742000102996826,9.736000061035156 C-4.742000102996826,9.736000061035156 -4.914999961853027,9.637999534606934 -4.914999961853027,9.637999534606934 C-5.645999908447266,9.220000267028809 -6.473999977111816,9 -7.315999984741211,9 C-8.79800033569336,9 -10,7.797999858856201 -10,6.315999984741211 C-10,6.315999984741211 -10,0.7540000081062317 -10,0.7540000081062317 C-10,-0.5849999785423279 -9.112000465393066,-1.7619999647140503 -7.823999881744385,-2.130000114440918 C-7.823999881744385,-2.130000114440918 -5.789000034332275,-2.7119998931884766 -5.789000034332275,-2.7119998931884766 C-5.789000034332275,-2.7119998931884766 -4,-5.573999881744385 -4,-5.573999881744385 C-4,-5.573999881744385 -4,-8.52400016784668 -4,-8.52400016784668 C-4,-9.892000198364258 -2.8919999599456787,-11 -1.5240000486373901,-11 C0.9259999990463257,-11 2.99399995803833,-9.175000190734863 3.2980000972747803,-6.74399995803833 C3.2980000972747803,-6.74399995803833 3.375999927520752,-6.116000175476074 3.375999927520752,-6.116000175476074 C3.4639999866485596,-5.413000106811523 3.4579999446868896,-4.701000213623047 3.3589999675750732,-4 C3.3589999675750732,-4 5.5,-4 5.5,-4 C7.433000087738037,-4 9,-2.433000087738037 9,-0.5 C9,-0.40299999713897705 8.996000289916992,-0.3059999942779541 8.98799991607666,-0.210999995470047 C9.61400032043457,0.42100000381469727 10,1.2899999618530273 10,2.25 C10,2.9719998836517334 9.781999588012695,3.6419999599456787 9.407999992370605,4.198999881744385 C9.468000411987305,4.455999851226807 9.5,4.723999977111816 9.5,5 C9.5,6.198999881744385 8.89799976348877,7.25600004196167 7.979000091552734,7.88700008392334 C7.785999774932861,9.637999534606934 6.302000045776367,11 4.5,11 C4.5,11 0.01600000075995922,11 0.01600000075995922,11 C-1.652999997138977,11 -3.2929999828338623,10.564000129699707 -4.742000102996826,9.736000061035156z"></path>
                                                </g>
                                              </g>
                                            </g>
                                          </mask>
                                          <filter id="__lottie_element_572" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                                            <feComponentTransfer in="SourceGraphic">
                                              <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
                                            </feComponentTransfer>
                                          </filter>
                                          <mask id="__lottie_element_571" mask-type="alpha">
                                          	<g filter="url(#__lottie_element_572)">
                                          		<rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
                                          	</g>
                                          </mask>
                                          <filter id="__lottie_element_579" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                                            <feComponentTransfer in="SourceGraphic">
                                              <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
                                            </feComponentTransfer>
                                          </filter>
                                          <mask id="__lottie_element_578" mask-type="alpha">
                                            <g filter="url(#__lottie_element_579)">
                                              <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
                                              <g style={{display: "block"}} transform="matrix(1,0,0,1,32.3120002746582,37.345001220703125)" opacity="1">
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                  <path fill="rgb(63,84,255)" fill-opacity="1"
                                                        d=" M-2.75,-12 C-2.75,-12 -1.4119999408721924,-12 -1.4119999408721924,-12 C1.121000051498413,-12 3.6019999980926514,-10.359000205993652 4.250999927520752,-7.60699987411499 C4.423999786376953,-6.870999813079834 4.614999771118164,-5.929999828338623 4.702000141143799,-4.98199987411499 C7.426000118255615,-4.760000228881836 9.588000297546387,-2.553999900817871 9.741000175476074,0.1889999955892563 C10.067000389099121,0.8930000066757202 10.25,1.6770000457763672 10.25,2.5 C10.25,3.3239998817443848 10.067000389099121,4.10699987411499 9.741000175476074,4.810999870300293 C9.675999641418457,5.9770002365112305 9.246999740600586,7.046000003814697 8.569000244140625,7.90500020980835 C7.947999954223633,10.26200008392334 5.802000045776367,12 3.25,12 C3.25,12 -0.34599998593330383,12 -0.34599998593330383,12 C-2.007999897003174,12 -3.6540000438690186,11.661999702453613 -5.182000160217285,11.006999969482422 C-5.182000160217285,11.006999969482422 -6.005000114440918,10.654999732971191 -6.005000114440918,10.654999732971191 C-6.243000030517578,10.553000450134277 -6.5,10.5 -6.758999824523926,10.5 C-8.687000274658203,10.5 -10.25,8.937000274658203 -10.25,7.008999824523926 C-10.25,7.008999824523926 -10.25,1.6180000305175781 -10.25,1.6180000305175781 C-10.25,0.10300000011920929 -9.394000053405762,-1.281999945640564 -8.038999557495117,-1.9600000381469727 C-8.038999557495117,-1.9600000381469727 -7.486000061035156,-2.2360000610351562 -7.486000061035156,-2.2360000610351562 C-7.486000061035156,-2.2360000610351562 -6.25,-4.708000183105469 -6.25,-4.708000183105469 C-6.25,-4.708000183105469 -6.25,-8.5 -6.25,-8.5 C-6.25,-10.432999610900879 -4.683000087738037,-12 -2.75,-12z"></path>
                                                </g>
                                              </g>
                                            </g>
                                          </mask>
                                          <filter id="__lottie_element_586" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                                            <feComponentTransfer in="SourceGraphic">
                                              <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
                                            </feComponentTransfer>
                                          </filter>
                                          <mask id="__lottie_element_585" mask-type="alpha">
                                            <g filter="url(#__lottie_element_586)">
                                              <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
                                            </g>
                                          </mask>
                                        </defs>
                                        <g clip-path="url(#__lottie_element_546)">
                                          <g style={{display: "block"}} mask="url(#__lottie_element_578)">
                                            <g transform="matrix(1,0,0,1,39.81199645996094,33.90599822998047)"
                                               opacity="1">
                                              <g opacity="1"
                                                 transform="matrix(1,0,0,1,0,0)">
                                                <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="2"
                                                      d=" M-2.75,-9 C-2.75,-9 -1.4119999408721924,-9 -1.4119999408721924,-9 C-0.12099999934434891,-9 1.034999966621399,-8.175000190734863 1.3309999704360962,-6.918000221252441 C1.5509999990463257,-5.982999801635742 1.75,-4.892000198364258 1.75,-4 C1.75,-3.305000066757202 1.628999948501587,-2.6110000610351562 1.472000002861023,-2 C1.472000002861023,-2 4.25,-2 4.25,-2 C5.63100004196167,-2 6.75,-0.8809999823570251 6.75,0.5 C6.75,0.652999997138977 6.736000061035156,0.8029999732971191 6.710000038146973,0.9480000138282776 C7.047999858856201,1.3739999532699585 7.25,1.9140000343322754 7.25,2.5 C7.25,3.0859999656677246 7.047999858856201,3.625999927520752 6.710000038146973,4.052000045776367 C6.736000061035156,4.197000026702881 6.75,4.3470001220703125 6.75,4.5 C6.75,5.317999839782715 6.35699987411499,6.044000148773193 5.75,6.5 C5.75,7.88100004196167 4.63100004196167,9 3.25,9 C3.25,9 -0.34599998593330383,9 -0.34599998593330383,9 C-1.6019999980926514,9 -2.8450000286102295,8.744999885559082 -4,8.25 C-4,8.25 -4.822999954223633,7.896999835968018 -4.822999954223633,7.896999835968018 C-5.434999942779541,7.635000228881836 -6.093999862670898,7.5 -6.758999824523926,7.5 C-7.03000020980835,7.5 -7.25,7.28000020980835 -7.25,7.008999824523926 C-7.25,7.008999824523926 -7.25,1.6180000305175781 -7.25,1.6180000305175781 C-7.25,1.2389999628067017 -7.035999774932861,0.8930000066757202 -6.697000026702881,0.7239999771118164 C-6.697000026702881,0.7239999771118164 -5.8460001945495605,0.2980000078678131 -5.8460001945495605,0.2980000078678131 C-5.459000110626221,0.10400000214576721 -5.145999908447266,-0.20900000631809235 -4.952000141143799,-0.5960000157356262 C-4.952000141143799,-0.5960000157356262 -3.3559999465942383,-3.7890000343322754 -3.3559999465942383,-3.7890000343322754 C-3.2869999408721924,-3.927999973297119 -3.25,-4.080999851226807 -3.25,-4.236000061035156 C-3.25,-4.236000061035156 -3.25,-8.5 -3.25,-8.5 C-3.25,-8.776000022888184 -3.0260000228881836,-9 -2.75,-9z"></path>
                                              </g>
                                            </g>
                                          </g>
                                          <g style={{display: "block"}} transform="matrix(1,0,0,1,32.3120002746582,37.90700149536133)" opacity="1">
                                            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="2"
                                                    d=" M-2.75,-9 C-2.75,-9 -1.4119999408721924,-9 -1.4119999408721924,-9 C-0.12099999934434891,-9 1.034999966621399,-8.175000190734863 1.3309999704360962,-6.918000221252441 C1.5509999990463257,-5.982999801635742 1.75,-4.892000198364258 1.75,-4 C1.75,-3.305000066757202 1.628999948501587,-2.6110000610351562 1.472000002861023,-2 C1.472000002861023,-2 4.25,-2 4.25,-2 C5.63100004196167,-2 6.75,-0.8809999823570251 6.75,0.5 C6.75,0.652999997138977 6.736000061035156,0.8029999732971191 6.710000038146973,0.9480000138282776 C7.047999858856201,1.3739999532699585 7.25,1.9140000343322754 7.25,2.5 C7.25,3.0859999656677246 7.047999858856201,3.625999927520752 6.710000038146973,4.052000045776367 C6.736000061035156,4.197000026702881 6.75,4.3470001220703125 6.75,4.5 C6.75,5.317999839782715 6.35699987411499,6.044000148773193 5.75,6.5 C5.75,7.88100004196167 4.63100004196167,9 3.25,9 C3.25,9 -0.34599998593330383,9 -0.34599998593330383,9 C-1.6019999980926514,9 -2.8450000286102295,8.744999885559082 -4,8.25 C-4,8.25 -4.822999954223633,7.896999835968018 -4.822999954223633,7.896999835968018 C-5.434999942779541,7.635000228881836 -6.093999862670898,7.5 -6.758999824523926,7.5 C-7.03000020980835,7.5 -7.25,7.28000020980835 -7.25,7.008999824523926 C-7.25,7.008999824523926 -7.25,1.6180000305175781 -7.25,1.6180000305175781 C-7.25,1.2389999628067017 -7.035999774932861,0.8930000066757202 -6.697000026702881,0.7239999771118164 C-6.697000026702881,0.7239999771118164 -5.8460001945495605,0.2980000078678131 -5.8460001945495605,0.2980000078678131 C-5.459000110626221,0.10400000214576721 -5.145999908447266,-0.20900000631809235 -4.952000141143799,-0.5960000157356262 C-4.952000141143799,-0.5960000157356262 -3.3559999465942383,-3.7890000343322754 -3.3559999465942383,-3.7890000343322754 C-3.2869999408721924,-3.927999973297119 -3.25,-4.080999851226807 -3.25,-4.236000061035156 C-3.25,-4.236000061035156 -3.25,-8.5 -3.25,-8.5 C-3.25,-8.776000022888184 -3.0260000228881836,-9 -2.75,-9z"></path>
                                            </g>
                                          </g>
                                          <g clip-path="url(#__lottie_element_548)" style={{display: "block"}} transform="matrix(0.15610000491142273,0,0,0.15610000491142273,3.249500274658203,-0.7504997253417969)" opacity="1">
                                          </g>
                                        </g>
                                      </svg>
                                      }
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="buttonControls--expand-button ltr-bjn8wh">
                        <OpenModalButton
                            buttonText={
                              <div className="ltr-1st24vv">
                                <div className="small ltr-iyulz3">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="ltr-4z3qvp e1svuwfo1"
                                       data-name="ChevronDown" aria-hidden="true">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z"
                                          fill="currentColor">
                                    </path>
                                  </svg>
                                </div>
                              </div>
                            }
                            onButtonClick={() => closeMiniModal()}
                            modalComponent={<MoreMovieInfo movie={movie}/>}
                        />
                      </div>
                    </div>
                    <div className="previewModal--metadatAndControls-info" style={{opacity: 1}}>
                      <div>
                        <div className="">
                          <div data-uia="videoMetadata--container" className="videoMetadata--container">
                            <div className="videoMetadata--first-line">
                              <span className="match-score-wrapper">
                                <div className="show-match-score rating-inner">
                                  <span className="match-score">94% Match</span>
                                </div>
                              </span>
                            </div>
                            <div className="videoMetadata--second-line">
                              <span className="maturity-rating ">
                                <span className="maturity-number">{movie.maturity}</span>
                              </span>
                              <span className="duration">{movie?.runtime}</span>
                              <span className="player-feature-badge">HD</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="previewModal--metadatAndControls-tags-container" style={{opacity: 1}}>
                      <div className="evidence-tags">
                        <div className="evidence-list">
                          {movie?.genres.map((genre, index) => (
                              <div className="evidence-item">
                                {index !== 0 && <span className="evidence-separator"></span>}
                                <span
                                    key={index}>{genre.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
                              </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
  );
}

export default OpenMovieModal;