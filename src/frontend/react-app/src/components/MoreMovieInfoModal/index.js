import React, {useContext, useRef, useState} from "react";

import "./MoreMovieInfo.css";
import {useModal} from "../../context/Modal";
import {NavLink} from "react-router-dom";
import {
	createDislike,
	createLike, createMovieRating, createViewedMovie,
	createWatchLaterMovie,
	deleteDislike,
	deleteLike, deleteMovieRating,
	deleteWatchLaterMovie, updateMovieRating, updateViewedMovie
} from "../../store/session";
import {useDispatch, useSelector} from "react-redux";
import {ProfileContext} from "../../context/Profile";


function MoreMovieInfo({ movie }) {
	const dispatch = useDispatch();

	const [videoEnded, setVideoEnded] = useState(false);
	let [liked, setLiked] = useState(false);
	let [disliked, setDisliked] = useState(false);

	let [watchLater, setWatchLater] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	const { profile, updateProfile } = useContext(ProfileContext);
	const sessionUser = useSelector(state => state.session.user);
	const updatedProfile = sessionUser.profiles.find(profiles => profiles.profileId === profile.profileId)
	const likedRef = useRef();
	const videoRef = useRef(null);
	const { closeModal } = useModal();

	const openMenu = () => {
		setShowMenu(true);
	}
	const closeMenu = () => {
		setShowMenu(false);
	}

	const handleVideoEnd = () => {
		setVideoEnded(true);
	};

	if (updatedProfile.profileRatings) {
		for (let ratingObj of updatedProfile.profileRatings) {
			const { rating, movie: movieObj } = ratingObj;
			if (movieObj.movieId === movie.movieId) {
				if (rating === "like") {
					liked = true;
				} else if (rating === "dislike") {
					disliked = true;
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
			setLiked(false);
			setDisliked(false);
		} else if (existingRating) {
			await dispatch(updateMovieRating(profile, updatedRating));
			updateProfile(updatedProfile);
			setLiked(rating === "like");
			setDisliked(rating === "dislike");
		} else {
			await dispatch(createMovieRating(profile, newRating));
			updateProfile(updatedProfile);
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
		<>
			<div className="more-movie-detail-modal-video-container">
				<div className="detail-video-wrapper">
					<div className="detail-video">
						<video
							ref={videoRef}
							src={movie?.trailer}
							autoPlay
							playsInline={true}
							muted
							onEnded={handleVideoEnd}
						/>
					</div>
				</div>
				<div className="more-detail-poster-container">
					{videoEnded && (
						<img
							src={movie.media}
							alt="Image Overlay"
							className="image-overlay"
						/>
					)}
				</div>
				<div className="more-movie-detail-modal-buttons-title">
					<div className="more-movie-detail-modal-buttons-title-wrapper">
						<div className="more-movie-detail-modal-buttons-title-container">
							<h1>{movie.title}</h1>
							<div className="more-detail-video-buttons">
								<NavLink to="" className="more-detail-play-button">
									<button onClick={() => handleViewed(movie)}>
										<div className="play-button-div">
											<div className="play-button-svg-div">
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
													 xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1"
													 data-name="Play" aria-hidden="true">
													<path
														d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
														fill="currentColor"></path>
												</svg>
											</div>
											<span>Play</span>
										</div>
									</button>
								</NavLink>
								<div className="more-detail-buttons">
									<button className="more-detail-button-container" onClick={() => handleWatchLaterMovie(movie)}>
										<div className="button-svg">
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
								<div className="more-detail-buttons">
									<button className="more-detail-button-container" onMouseEnter={openMenu}>
										<div className="button-svg">
											{renderLikedStatus()}
										</div>
									</button>
									<div className={`liked-overlay ${showMenu ? 'visible' : ''}`} ref={likedRef} onMouseLeave={closeMenu}>
										<div data-uia="thumbs-selection-popover">
											<div>
												<div className="selection">
													<div className="disliked-liked-selection">
														<button className="selection-button" onClick={() => handleRating("dislike", movie)}>
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
													<div className="disliked-liked-selection">
														<button className="selection-button like" onClick={() => handleRating("like", movie)}>
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
												{/*<div className="ltr-52zukg">*/}
												{/*	<button*/}
												{/*		className="color-supplemental small hasIcon round ltr-919wh7"*/}
												{/*		data-uia="thumbs-menu-close" type="button">*/}
												{/*		<div className="ltr-1st24vv">*/}
												{/*			<div className="small ltr-iyulz3" role="presentation">*/}
												{/*				<svg width="24" height="24" viewBox="0 0 24 24"*/}
												{/*					 fill="none" xmlns="http://www.w3.org/2000/svg"*/}
												{/*					 className="ltr-4z3qvp e1svuwfo1" data-name="X"*/}
												{/*					 aria-hidden="true">*/}
												{/*					<path fill-rule="evenodd" clip-rule="evenodd"*/}
												{/*						  d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z"*/}
												{/*						  fill="currentColor"></path>*/}
												{/*				</svg>*/}
												{/*			</div>*/}
												{/*		</div>*/}
												{/*	</button>*/}
												{/*</div>*/}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="more-detail-mute-button-container">
							<div className="more-detail-buttons">
								<button className="more-detail-button-container-mute">
									<div className="button-svg">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
											 xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1"
											 data-name="VolumeHigh" aria-hidden="true">
											<path fill-rule="evenodd" clip-rule="evenodd"
												  d="M24 12C24 8.28693 22.525 4.72597 19.8995 2.10046L18.4853 3.51468C20.7357 5.76511 22 8.81736 22 12C22 15.1826 20.7357 18.2348 18.4853 20.4852L19.8995 21.8995C22.525 19.2739 24 15.713 24 12ZM11 3.99995C11 3.59549 10.7564 3.23085 10.3827 3.07607C10.009 2.92129 9.57889 3.00685 9.29289 3.29285L4.58579 7.99995H1C0.447715 7.99995 0 8.44767 0 8.99995V15C0 15.5522 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0786 10.3827 20.9238C10.7564 20.7691 11 20.4044 11 20V3.99995ZM5.70711 9.70706L9 6.41417V17.5857L5.70711 14.2928L5.41421 14H5H2V9.99995H5H5.41421L5.70711 9.70706ZM16.0001 12C16.0001 10.4087 15.368 8.88254 14.2428 7.75732L12.8285 9.17154C13.5787 9.92168 14.0001 10.9391 14.0001 12C14.0001 13.0608 13.5787 14.0782 12.8285 14.8284L14.2428 16.2426C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92889C18.9462 6.80426 19.9998 9.3478 19.9998 12C19.9998 14.6521 18.9462 17.1957 17.0709 19.071L15.6567 17.6568C17.157 16.1565 17.9998 14.1217 17.9998 12C17.9998 9.87823 17.157 7.8434 15.6567 6.34311L17.0709 4.92889Z"
												  fill="currentColor"></path>
										</svg>
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="more-detail-close-container" onClick={() => closeModal()}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
					 className="ltr-4z3qvp e1svuwfo1" data-name="X" aria-labelledby="preview-modal-70098611"
					 data-uia="previewModal-closebtn" role="button" aria-label="close" tabIndex="0"><title
					id="preview-modal-70098611">close</title>
					<path fill-rule="evenodd" clip-rule="evenodd"
						  d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z"
						  fill="currentColor"></path>
				</svg>
			</div>
			<div className="more-movie-detail-info-container">
				<div className="more-movie-detail-info-wrapper">
					<div className="detail-movie-info-container">
						<div>
							<div className="detail-movie-info">
								<div className="detail-movie-info-left">
									<div className="detail-movie-info-more">
										<div className="movie-detail">
											<span className="detail-movie-info-more-year">
												Year
											</span>
											<span className="detail-movie-info-more-runtime">
												{movie.runtime}
											</span>
											<span className="player-feature-badge">HD</span>
										</div>
										<div>
										<span className="maturity-rating">
											<span className="maturity-number">PG-13</span>
										</span>
										</div>
									</div>
									<p className="detail-movie-info-description">
										{movie.description}
									</p>
								</div>
								<div className="detail-movie-info-right">
									<div className="detail-movie-info-right-cast">
										<span className="detail-movie-info-right-cast-header">
											Cast:
										</span>
										<span className="detail-movie-info-right-cast-names">
                							{movie?.casts.map((cast, index) => (
												<span key={index}>{cast},</span>
											))}
										</span>
									</div>
									<div className="detail-movie-info-right-genres">
										<span className="detail-movie-info-right-cast-header">
											Genres:
										</span>
										<span className="detail-movie-info-right-cast-names">
                							{movie?.genres.map((genre, index) => (
												<span key={index}>{genre},</span>
											))}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="detail-modal-more-like">
						<h3>More Like This</h3>
						<div className="detail-modal-more-like-movies-wrapper">
							<div className="detail-modal-more-like-movies">
								Coming Soon!
							</div>
							<div className="section-divider"></div>
						</div>
					</div>
					<div className="more-detail-about-wrapper">
						<div className="about-header">
							<h3>
								About {movie.title}
							</h3>
						</div>
						<div className="about-container">
							<div className="about-info">
								<span className="about-title">
									Director:
								</span>
								<span className="about-item">
									<p>{movie.director}</p>
								</span>
							</div>
							<div className="about-info">
								<span className="about-title">
									Cast:
								</span>
								<span className="about-item">
								{movie?.casts.map((cast, index) => (
									<p key={index}>{cast},</p>
								))}
								</span>
							</div>
							<div className="about-info">
								<span className="about-title">
									Writer:
								</span>
								<span className="about-item">
								{movie?.writers.map((writer, index) => (
									<p key={index}>{writer},</p>
								))}
								</span>
							</div>
							<div className="about-info">
								<span className="about-title">
									Genres:
								</span>
								<span className="about-item">
									{movie?.genres.map((genre, index) => (
										<span key={index}>{genre},</span>
									))}
								</span>
							</div>
							<div className="about-info">
								<span className="about-title">
									Maturity Rating:
								</span>
								<span className="about-item">
									<p>{movie.maturity}</p>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default MoreMovieInfo;
