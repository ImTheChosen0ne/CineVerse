import React, {useContext, useEffect, useRef, useState} from "react";

import "./MoreMovieInfo.css";
import {useModal} from "../../context/Modal";
import {NavLink} from "react-router-dom";
import {
	createMovieRating, createViewedMovie,
	createWatchLaterMovie,
	deleteMovieRating,
	deleteWatchLaterMovie, updateMovieRating, updateViewedMovie
} from "../../store/session";
import {useDispatch, useSelector} from "react-redux";
import {ProfileContext} from "../../context/Profile";
import {getMovies} from "../../store/movies";


function MoreMovieInfo({movie}) {
	const dispatch = useDispatch();
	const movies = Object.values(useSelector((state) => state.movies));
	const [videoEnded, setVideoEnded] = useState(false);
	let [liked, setLiked] = useState(false);
	let [disliked, setDisliked] = useState(false);

	let [watchLater, setWatchLater] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [collapsed, setCollapsed] = useState("collapsed");


	const {profile, updateProfile} = useContext(ProfileContext);
	const sessionUser = useSelector(state => state.session.user);
	const updatedProfile = sessionUser.profiles.find(profiles => profiles.profileId === profile.profileId)
	const likedRef = useRef();
	const videoRef = useRef(null);
	const { closeModal } = useModal();

	useEffect(() => {
		dispatch(getMovies());
	}, [dispatch]);

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
			const {rating, movie: movieObj} = ratingObj;
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
		const options = {day: 'numeric', month: 'numeric', year: 'numeric'};
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

		const updatedRating = {
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

		const updatedViewed = {
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
		// <>
		// 	<div className="more-movie-detail-modal-video-container">
		// 		<div className="detail-video-wrapper">
		// 			<div className="detail-video">
		// 				<video
		// 					ref={videoRef}
		// 					src={movie?.trailer}
		// 					autoPlay
		// 					playsInline={true}
		// 					muted
		// 					onEnded={handleVideoEnd}
		// 				/>
		// 			</div>
		// 		</div>
		// 		<div className="more-detail-poster-container">
		// 			{videoEnded && (
		// 				<img
		// 					src={movie.media}
		// 					alt="Overlay"
		// 					className="image-overlay"
		// 				/>
		// 			)}
		// 		</div>
		// 		<div className="more-movie-detail-modal-buttons-title">
		// 			<div className="more-movie-detail-modal-buttons-title-wrapper">
		// 				<div className="more-movie-detail-modal-buttons-title-container">
		// 					<h1>{movie.title}</h1>
		// 					<div className="more-detail-video-buttons">
		// 						<NavLink to="" className="more-detail-play-button">
		// 							<button onClick={() => handleViewed(movie)}>
		// 								<div className="play-button-div">
		// 									<div className="play-button-svg-div">
		// 										<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
		// 											 xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1"
		// 											 data-name="Play" aria-hidden="true">
		// 											<path
		// 												d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
		// 												fill="currentColor"></path>
		// 										</svg>
		// 									</div>
		// 									<span>Play</span>
		// 								</div>
		// 							</button>
		// 						</NavLink>
		// 						<div className="more-detail-buttons">
		// 							<button className="more-detail-button-container"
		// 									onClick={() => handleWatchLaterMovie(movie)}>
		// 								<div className="button-svg">
		// 									{watchLater ?
		// 										<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
		// 											 xmlns="http://www.w3.org/2000/svg"
		// 											 className="ltr-4z3qvp e1svuwfo1" data-name="Checkmark"
		// 											 aria-hidden="true">
		// 											<path fill-rule="evenodd" clip-rule="evenodd"
		// 												  d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
		// 												  fill="currentColor"></path>
		// 										</svg>
		// 										:
		// 										<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
		// 											 xmlns="http://www.w3.org/2000/svg"
		// 											 className="ltr-4z3qvp e1svuwfo1" data-name="Plus"
		// 											 aria-hidden="true">
		// 											<path fill-rule="evenodd" clip-rule="evenodd"
		// 												  d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
		// 												  fill="currentColor"></path>
		// 										</svg>
		// 									}
		// 								</div>
		// 							</button>
		// 						</div>
		// 						<div className="more-detail-buttons">
		// 							<button className="more-detail-button-container" onMouseEnter={openMenu}>
		// 								<div className="button-svg">
		// 									{renderLikedStatus()}
		// 								</div>
		// 							</button>
		// 							<div className={`liked-overlay ${showMenu ? 'visible' : ''}`} ref={likedRef}
		// 								 onMouseLeave={closeMenu}>
		// 								<div data-uia="thumbs-selection-popover">
		// 									<div>
		// 										<div className="selection">
		// 											<div className="disliked-liked-selection">
		// 												<button className="selection-button"
		// 														onClick={() => handleRating("dislike", movie)}>
		// 													{disliked ?
		// 														<svg width="24" height="24" viewBox="0 0 24 24"
		// 															 fill="none"
		// 															 xmlns="http://www.w3.org/2000/svg"
		// 															 className="ltr-4z3qvp e1svuwfo1 disliked"
		// 															 data-name="ThumbsUpFill"
		// 															 aria-hidden="true">
		// 															<path fill-rule="evenodd" clip-rule="evenodd"
		// 																  d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z"
		// 																  fill="currentColor"></path>
		// 														</svg>
		// 														:
		// 														<svg width="24" height="24" viewBox="0 0 24 24"
		// 															 fill="none"
		// 															 xmlns="http://www.w3.org/2000/svg"
		// 															 className="ltr-4z3qvp e1svuwfo1 disliked"
		// 															 data-name="ThumbsUp"
		// 															 aria-hidden="true">
		// 															<path fill-rule="evenodd" clip-rule="evenodd"
		// 																  d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
		// 																  fill="currentColor"></path>
		// 														</svg>
		// 													}
		// 												</button>
		// 											</div>
		// 											<div className="disliked-liked-selection">
		// 												<button className="selection-button like"
		// 														onClick={() => handleRating("like", movie)}>
		// 													{liked ?
		// 														<svg width="24" height="24" viewBox="0 0 24 24"
		// 															 fill="none"
		// 															 xmlns="http://www.w3.org/2000/svg"
		// 															 className="ltr-4z3qvp e1svuwfo1"
		// 															 data-name="ThumbsUpFill"
		// 															 aria-hidden="true">
		// 															<path fill-rule="evenodd" clip-rule="evenodd"
		// 																  d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z"
		// 																  fill="currentColor"></path>
		// 														</svg>
		// 														:
		// 														<svg width="24" height="24" viewBox="0 0 24 24"
		// 															 fill="none"
		// 															 xmlns="http://www.w3.org/2000/svg"
		// 															 className="ltr-4z3qvp e1svuwfo1"
		// 															 data-name="ThumbsUp"
		// 															 aria-hidden="true">
		// 															<path fill-rule="evenodd" clip-rule="evenodd"
		// 																  d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
		// 																  fill="currentColor"></path>
		// 														</svg>
		// 													}
		// 												</button>
		// 											</div>
		// 										</div>
		// 										{/*<div className="ltr-52zukg">*/}
		// 										{/*	<button*/}
		// 										{/*		className="color-supplemental small hasIcon round ltr-919wh7"*/}
		// 										{/*		data-uia="thumbs-menu-close" type="button">*/}
		// 										{/*		<div className="ltr-1st24vv">*/}
		// 										{/*			<div className="small ltr-iyulz3" role="presentation">*/}
		// 										{/*				<svg width="24" height="24" viewBox="0 0 24 24"*/}
		// 										{/*					 fill="none" xmlns="http://www.w3.org/2000/svg"*/}
		// 										{/*					 className="ltr-4z3qvp e1svuwfo1" data-name="X"*/}
		// 										{/*					 aria-hidden="true">*/}
		// 										{/*					<path fill-rule="evenodd" clip-rule="evenodd"*/}
		// 										{/*						  d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z"*/}
		// 										{/*						  fill="currentColor"></path>*/}
		// 										{/*				</svg>*/}
		// 										{/*			</div>*/}
		// 										{/*		</div>*/}
		// 										{/*	</button>*/}
		// 										{/*</div>*/}
		// 									</div>
		// 								</div>
		// 							</div>
		// 						</div>
		// 					</div>
		// 				</div>
		// 				<div className="more-detail-mute-button-container">
		// 					<div className="more-detail-buttons">
		// 						<button className="more-detail-button-container-mute">
		// 							<div className="button-svg">
		// 								<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
		// 									 xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1"
		// 									 data-name="VolumeHigh" aria-hidden="true">
		// 									<path fill-rule="evenodd" clip-rule="evenodd"
		// 										  d="M24 12C24 8.28693 22.525 4.72597 19.8995 2.10046L18.4853 3.51468C20.7357 5.76511 22 8.81736 22 12C22 15.1826 20.7357 18.2348 18.4853 20.4852L19.8995 21.8995C22.525 19.2739 24 15.713 24 12ZM11 3.99995C11 3.59549 10.7564 3.23085 10.3827 3.07607C10.009 2.92129 9.57889 3.00685 9.29289 3.29285L4.58579 7.99995H1C0.447715 7.99995 0 8.44767 0 8.99995V15C0 15.5522 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0786 10.3827 20.9238C10.7564 20.7691 11 20.4044 11 20V3.99995ZM5.70711 9.70706L9 6.41417V17.5857L5.70711 14.2928L5.41421 14H5H2V9.99995H5H5.41421L5.70711 9.70706ZM16.0001 12C16.0001 10.4087 15.368 8.88254 14.2428 7.75732L12.8285 9.17154C13.5787 9.92168 14.0001 10.9391 14.0001 12C14.0001 13.0608 13.5787 14.0782 12.8285 14.8284L14.2428 16.2426C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92889C18.9462 6.80426 19.9998 9.3478 19.9998 12C19.9998 14.6521 18.9462 17.1957 17.0709 19.071L15.6567 17.6568C17.157 16.1565 17.9998 14.1217 17.9998 12C17.9998 9.87823 17.157 7.8434 15.6567 6.34311L17.0709 4.92889Z"
		// 										  fill="currentColor"></path>
		// 								</svg>
		// 							</div>
		// 						</button>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// 	<div className="more-detail-close-container" onClick={() => closeModal()}>
		// 		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
		// 			 className="ltr-4z3qvp e1svuwfo1" data-name="X" aria-labelledby="preview-modal-70098611"
		// 			 data-uia="previewModal-closebtn" role="button" aria-label="close" tabIndex="0"><title
		// 			id="preview-modal-70098611">close</title>
		// 			<path fill-rule="evenodd" clip-rule="evenodd"
		// 				  d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z"
		// 				  fill="currentColor"></path>
		// 		</svg>
		// 	</div>
		// 	<div className="more-movie-detail-info-container">
		// 		<div className="more-movie-detail-info-wrapper">
		// 			<div className="detail-movie-info-container">
		// 				<div>
		// 					<div className="detail-movie-info">
		// 						<div className="detail-movie-info-left">
		// 							<div className="detail-movie-info-more">
		// 								<div className="movie-detail">
		// 									<span className="detail-movie-info-more-year">
		// 										Year
		// 									</span>
		// 									<span className="detail-movie-info-more-runtime">
		// 										{movie.runtime}
		// 									</span>
		// 									<span className="player-feature-badge">HD</span>
		// 								</div>
		// 								<div>
		// 								<span className="maturity-rating">
		// 									<span className="maturity-number">PG-13</span>
		// 								</span>
		// 								</div>
		// 							</div>
		// 							<p className="detail-movie-info-description">
		// 								{movie.description}
		// 							</p>
		// 						</div>
		// 						<div className="detail-movie-info-right">
		// 							<div className="detail-movie-info-right-cast">
		// 								<span className="detail-movie-info-right-cast-header">
		// 									Cast:
		// 								</span>
		// 								<span className="detail-movie-info-right-cast-names">
		//         							{movie?.casts.map((cast, index) => (
		// 										<span key={index}>{cast},</span>
		// 									))}
		// 								</span>
		// 							</div>
		// 							<div className="detail-movie-info-right-genres">
		// 								<span className="detail-movie-info-right-cast-header">
		// 									Genres:
		// 								</span>
		// 								<span className="detail-movie-info-right-cast-names">
		//         							{movie?.genres.map((genre, index) => (
		// 										<span key={index}>{genre},</span>
		// 									))}
		// 								</span>
		// 							</div>
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 			<div className="detail-modal-more-like">
		// 				<h3>More Like This</h3>
		// 				<div className="detail-modal-more-like-movies-wrapper">
		// 					<div className="detail-modal-more-like-movies">
		// 						Coming Soon!
		// 					</div>
		// 					<div className="section-divider"></div>
		// 				</div>
		// 			</div>
		// 			<div className="more-detail-about-wrapper">
		// 				<div className="about-header">
		// 					<h3>
		// 						About {movie.title}
		// 					</h3>
		// 				</div>
		// 				<div className="about-container">
		// 					<div className="about-info">
		// 						<span className="about-title">
		// 							Director:
		// 						</span>
		// 						<span className="about-item">
		// 							<p>{movie.director}</p>
		// 						</span>
		// 					</div>
		// 					<div className="about-info">
		// 						<span className="about-title">
		// 							Cast:
		// 						</span>
		// 						<span className="about-item">
		// 						{movie?.casts.map((cast, index) => (
		// 							<p key={index}>{cast},</p>
		// 						))}
		// 						</span>
		// 					</div>
		// 					<div className="about-info">
		// 						<span className="about-title">
		// 							Writer:
		// 						</span>
		// 						<span className="about-item">
		// 						{movie?.writers.map((writer, index) => (
		// 							<p key={index}>{writer},</p>
		// 						))}
		// 						</span>
		// 					</div>
		// 					<div className="about-info">
		// 						<span className="about-title">
		// 							Genres:
		// 						</span>
		// 						<span className="about-item">
		// 							{movie?.genres.map((genre, index) => (
		// 								<span key={index}>{genre},</span>
		// 							))}
		// 						</span>
		// 					</div>
		// 					<div className="about-info">
		// 						<span className="about-title">
		// 							Maturity Rating:
		// 						</span>
		// 						<span className="about-item">
		// 							<p>{movie.maturity}</p>
		// 						</span>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// </>
		<div className="focus-trap-wrapper previewModal--wrapper detail-modal has-smaller-buttons">
			<div className="previewModal--container detail-modal has-smaller-buttons"
				 style={{width: "1107.06px", top: "542px", left: "auto", transformOrigin: "center top 0px", transform: "translateX(0px) translateY(calc(2em - 542px)) scaleX(1) scaleY(1) translateZ(0px)",boxShadow: "rgba(0, 0, 0, 0.75) 0px 3px 10px", zIndex: 2, opacity: 1, marginBottom: "2em", minWidth: "850px"}}>
				<div className="previewModal--player_container detail-modal has-smaller-buttons">
					<div style={{position: "absolute", width: "100%", height: "100%",overflow: "hidden"}}>
						<div style={{position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
							<video style={{position: "absolute", width: "100%", height: "100%", objectFit: "cover"}}
								   src={movie.trailer}
								   ref={videoRef}
								   autoPlay
								   playsInline={true}
								   muted
								   onEnded={handleVideoEnd}
							/>
						</div>
					</div>
					<div className="videoMerchPlayer--boxart-wrapper" style={{position: "absolute"}}>
						{/*<img className="previewModal--boxart"*/}
						{/*	 src="https://occ-0-616-621.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABQVWLAn6N4P6_ky3GGqMCBdD4uzu1y0CmYysm-QyZYq4wpxQIR0d4vCHDYbc8v5yqLaQx1Rbs44xmYurigCfEL6coo18z3XMOYTRQh0jzF82Pe0LdYi_TrZE9feCktUmPzc_Z38fXePH7zPB9yQaGKz6ZJ0oCcfcZDMqMHDlZwXygILfW95qimo-k1Hd-YBeu2222ywXEhR7IYnZa80Avj2cvZgB_CGYjlr-rsiH3l7r2-gzfmOrxmjiKsyinetnqFvzmwLwvQcAIOXK3Joj_-EtrpkzP-Seipj0JYtz6VzwLhrFE6GSsJo_jjI5ebOYH5b3h8sclGIhtxc9N647vjCy.jpg?r=92c"*/}
						{/*	 alt="This Is Us" style={{opacity: 0}}/>*/}
						{/*<img alt=""*/}
						{/*	 src="https://occ-0-616-621.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABQVWLAn6N4P6_ky3GGqMCBdD4uzu1y0CmYysm-QyZYq4wpxQIR0d4vCHDYbc8v5yqLaQx1Rbs44xmYurigCfEL6coo18z3XMOYTRQh0jzF82Pe0LdYi_TrZE9feCktUmPzc_Z38fXePH7zPB9yQaGKz6ZJ0oCcfcZDMqMHDlZwXygILfW95qimo-k1Hd-YBeu2222ywXEhR7IYnZa80Avj2cvZgB_CGYjlr-rsiH3l7r2-gzfmOrxmjiKsyinetnqFvzmwLwvQcAIOXK3Joj_-EtrpkzP-Seipj0JYtz6VzwLhrFE6GSsJo_jjI5ebOYH5b3h8sclGIhtxc9N647vjCy.jpg?r=92c"*/}
						{/*	 style={{display: "none"}}/>*/}
					</div>
					<div className="storyArt detail-modal has-smaller-buttons">
						{/*{videoEnded && (*/}
						{/*<img src={movie.media} alt={movie.title} className="playerModel--player__storyArt detail-modal has-smaller-buttons" style={{opacity: 1}}/>*/}
						{/*)}*/}
						{/*<img alt="" src="" style={{display: "none"}}/>*/}
					</div>
					<div style={{opacity: 1}}>
						<div className="previewModal--player-titleTreatmentWrapper" style={{opacity: 1}}>
							<div className="previewModal--player-titleTreatment-left previewModal--player-titleTreatment detail-modal has-smaller-buttons detail-modal has-smaller-buttons">
								<img alt="" src="https://occ-0-616-621.1.nflxso.net/dnm/api/v6/tx1O544a9T7n8Z_G12qaboulQQE/AAAABYl2xd1rM_KgFFzuWQq0jMp3bO0PTSOds90-7LA4xP74zuqDu-nklU8Cj1izisKKmOzUXIhjCXKY_wgxPahYYP6cphU6LGQERC7PERdnwlI.png?r=317"
									 style={{display: "none"}}/>
								<h1 className="previewModal--player-titleTreatment-logo" style={{width: "100%", opacity: 1, fontSize: "5rem", fontWeight:400, whiteSpace: "nowrap"}} >{movie.title}</h1>
								{/*<img className="previewModal--player-titleTreatment-logo" alt="" src={} style={{width: "100%", opacity: 1}}/>*/}
								<div className="buttonControls--container" data-uia="mini-modal-controls">
									<a href="" className="primary-button playLink isToolkit">
										<button className="color-primary hasLabel hasIcon ltr-podnco">
											<div className="ltr-1st24vv">
												<div className="medium ltr-iyulz3">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
														 xmlns="http://www.w3.org/2000/svg"
														 className="ltr-4z3qvp e1svuwfo1"
														 data-name="Play" aria-hidden="true">
														<path
															d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
															fill="currentColor"></path>
													</svg>
												</div>
											</div>
											<div className="ltr-1npqywr" style={{width: "1rem"}}></div>
											<span className="ltr-1vh9doa">Play</span>
										</button>
									</a>
									<div className="ltr-bjn8wh">
										<div className="ptrack-content">
											<button className="color-supplementary hasIcon round ltr-11vo9g5">
												<div className="ltr-1st24vv">
													<div className="small ltr-iyulz3">
														<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
															 xmlns="http://www.w3.org/2000/svg"
															 className="ltr-4z3qvp e1svuwfo1"
															 data-name="Checkmark" aria-hidden="true">
															<path fill-rule="evenodd" clip-rule="evenodd"
																  d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
																  fill="currentColor">
															</path>
														</svg>
													</div>
												</div>
											</button>
										</div>
									</div>
									<div className="ltr-179t5g5">
										<button className="color-supplementary hasIcon round ltr-126oqy">
											<div className="ltr-1st24vv">
												<div className="small ltr-iyulz3">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
														 xmlns="http://www.w3.org/2000/svg"
														 className="ltr-4z3qvp e1svuwfo1"
														 data-name="ThumbsUp" aria-hidden="true">
														<path fill-rule="evenodd" clip-rule="evenodd"
															  d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
															  fill="currentColor">
														</path>
													</svg>
												</div>
											</div>
										</button>
									</div>
								</div>
								<div className="buttonControls--messaging"></div>
							</div>
							<div className="detail-modal has-smaller-buttons previewModal-audioToggle" style={{opacity: "0.4", display: "block"}}>
								<div className="global-supplemental-audio-toggle">
									<button className="color-supplementary hasIcon round ltr-11vo9g5">
										<div className="ltr-1st24vv">
											<div className="small ltr-iyulz3">
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
													 xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1"
													 data-name="VolumeOff" aria-hidden="true">
													<path fill-rule="evenodd" clip-rule="evenodd"
														  d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z"
														  fill="currentColor">
													</path>
												</svg>
											</div>
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="previewModal-close" onClick={() => closeModal()}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
						 className="ltr-4z3qvp e1svuwfo1" data-name="X" aria-labelledby="preview-modal-80113702"
						 data-uia="previewModal-closebtn" role="button" aria-label="close" tabIndex="0">
						<title id="preview-modal-80113702">close</title>
						<path fill-rule="evenodd" clip-rule="evenodd"
							  d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z"
							  fill="currentColor">
						</path>
					</svg>
				</div>
				<div className="previewModal--info" style={{opacity: 1, transform: "none"}}>
					<div className="detail-modal-container">
						<div className="ptrack-container">
							<div>
								<div className="previewModal--detailsMetadata detail-modal has-smaller-buttons">
									<div className="previewModal--detailsMetadata-left">
										<div className="previewModal--detailsMetadata-info">
											<div>
												<div className="">
													<div data-uia="videoMetadata--container"
														 className="videoMetadata--container">
														<div className="videoMetadata--first-line">
															<span className="match-score-wrapper">
																<div className="show-match-score rating-inner">
																	<span className="match-score">98% Match</span>
																</div>
															</span>
														</div>
														<div className="videoMetadata--second-line">
															<div className="year">{movie.releaseDate.split("-")[2]}</div>
															<span className="duration">{movie.runtime}</span>
															<span className="player-feature-badge">HD</span>
															<div className="ltr-bjn8wh">
																<div className="ltr-x1hvkl">
																	<div>
																		<svg width="16" height="16" viewBox="0 0 16 16"
																			 fill="none"
																			 xmlns="http://www.w3.org/2000/svg"
																			 className="ltr-4z3qvp e1svuwfo1"
																			 data-name="Subtitles" aria-hidden="true">
																			<path fill-rule="evenodd"
																				  clip-rule="evenodd"
																				  d="M0 1.75C0 1.33579 0.335786 1 0.75 1H15.25C15.6642 1 16 1.33579 16 1.75V12.25C16 12.6642 15.6642 13 15.25 13H12.75V15C12.75 15.2652 12.61 15.5106 12.3817 15.6456C12.1535 15.7806 11.8709 15.785 11.6386 15.6572L6.80736 13H0.75C0.335786 13 0 12.6642 0 12.25V1.75ZM1.5 2.5V11.5H7H7.19264L7.36144 11.5928L11.25 13.7315V12.25V11.5H12H14.5V2.5H1.5ZM6 6.5L3 6.5V5L6 5V6.5ZM13 7.5H10V9H13V7.5ZM3 9V7.5L9 7.5V9L3 9ZM13 5H7V6.5H13V5Z"
																				  fill="currentColor">
																			</path>
																		</svg>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className="ltr-7t0zr9">
													<a href="#about">
														<span className="maturity-rating ">
															<span className="maturity-number">TV-14</span>
														</span>
													</a>
													{movie.keywords.map((keyword, index) => (
														<span className="ltr-1q4vxyr">{keyword}{index !== movie.keywords.length - 1 && <span>,</span>}</span>
													))}
												</div>
											</div>
										</div>
										{/*<div className="ltr-s5xdrg">*/}
										{/*	<div className="supplemental-message previewModal--supplemental-message ltr-1leu95c"*/}
										{/*		 data-uia="dp-supplemental-message">*/}
										{/*		<svg viewBox="0 0 28 30" className="svg-icon svg-icon-top-10-badge">*/}
										{/*			<rect x="0" width="28" height="30" rx="3" fill="#e50914"></rect>*/}
										{/*			<path*/}
										{/*				d="M16.8211527,22.1690594 C17.4133103,22.1690594 17.8777709,21.8857503 18.2145345,21.3197261 C18.5512982,20.7531079 18.719977,19.9572291 18.719977,18.9309018 C18.719977,17.9045745 18.5512982,17.1081018 18.2145345,16.5414836 C17.8777709,15.9754594 17.4133103,15.6921503 16.8211527,15.6921503 C16.2289952,15.6921503 15.7645345,15.9754594 15.427177,16.5414836 C15.0904133,17.1081018 14.9223285,17.9045745 14.9223285,18.9309018 C14.9223285,19.9572291 15.0904133,20.7531079 15.427177,21.3197261 C15.7645345,21.8857503 16.2289952,22.1690594 16.8211527,22.1690594 M16.8211527,24.0708533 C15.9872618,24.0708533 15.2579042,23.8605988 14.6324861,23.4406836 C14.0076618,23.0207685 13.5247891,22.4262352 13.1856497,21.6564897 C12.8465103,20.8867442 12.6766436,19.9786109 12.6766436,18.9309018 C12.6766436,17.8921018 12.8465103,16.9857503 13.1856497,16.2118473 C13.5247891,15.4379442 14.0076618,14.8410352 14.6324861,14.4205261 C15.2579042,14.0006109 15.9872618,13.7903564 16.8211527,13.7903564 C17.6544497,13.7903564 18.3844012,14.0006109 19.0098194,14.4205261 C19.6352376,14.8410352 20.1169224,15.4379442 20.4566558,16.2118473 C20.7952012,16.9857503 20.9656618,17.8921018 20.9656618,18.9309018 C20.9656618,19.9786109 20.7952012,20.8867442 20.4566558,21.6564897 C20.1169224,22.4262352 19.6352376,23.0207685 19.0098194,23.4406836 C18.3844012,23.8605988 17.6544497,24.0708533 16.8211527,24.0708533"*/}
										{/*				fill="#FFFFFF">*/}
										{/*			</path>*/}
										{/*			<polygon fill="#FFFFFF"*/}
										{/*					 points="8.86676 23.9094206 8.86676 16.6651418 6.88122061 17.1783055 6.88122061 14.9266812 11.0750267 13.8558085 11.0750267 23.9094206">*/}

										{/*			</polygon>*/}
										{/*			<path*/}
										{/*				d="M20.0388194,9.42258545 L20.8085648,9.42258545 C21.1886861,9.42258545 21.4642739,9.34834303 21.6353285,9.19926424 C21.806383,9.05077939 21.8919103,8.83993091 21.8919103,8.56731273 C21.8919103,8.30122788 21.806383,8.09572485 21.6353285,7.94961576 C21.4642739,7.80410061 21.1886861,7.73104606 20.8085648,7.73104606 L20.0388194,7.73104606 L20.0388194,9.42258545 Z M18.2332436,12.8341733 L18.2332436,6.22006424 L21.0936558,6.22006424 C21.6323588,6.22006424 22.0974133,6.31806424 22.4906012,6.51465818 C22.8831952,6.71125212 23.1872921,6.98684 23.4028921,7.34142182 C23.6178982,7.69659758 23.7259952,8.10522788 23.7259952,8.56731273 C23.7259952,9.04246424 23.6178982,9.45762788 23.4028921,9.8122097 C23.1872921,10.1667915 22.8831952,10.4429733 22.4906012,10.6389733 C22.0974133,10.8355673 21.6323588,10.9335673 21.0936558,10.9335673 L20.0388194,10.9335673 L20.0388194,12.8341733 L18.2332436,12.8341733 Z"*/}
										{/*				fill="#FFFFFF">*/}
										{/*			</path>*/}
										{/*			<path*/}
										{/*				d="M14.0706788,11.3992752 C14.3937818,11.3992752 14.6770909,11.322063 14.9212,11.1664509 C15.1653091,11.0114327 15.3553697,10.792863 15.4913818,10.5107418 C15.6279879,10.2286206 15.695697,9.90136 15.695697,9.52717818 C15.695697,9.1535903 15.6279879,8.82573576 15.4913818,8.54361455 C15.3553697,8.26149333 15.1653091,8.04351758 14.9212,7.88790545 C14.6770909,7.73288727 14.3937818,7.65508121 14.0706788,7.65508121 C13.7475758,7.65508121 13.4642667,7.73288727 13.2201576,7.88790545 C12.9760485,8.04351758 12.7859879,8.26149333 12.6499758,8.54361455 C12.5139636,8.82573576 12.4456606,9.1535903 12.4456606,9.52717818 C12.4456606,9.90136 12.5139636,10.2286206 12.6499758,10.5107418 C12.7859879,10.792863 12.9760485,11.0114327 13.2201576,11.1664509 C13.4642667,11.322063 13.7475758,11.3992752 14.0706788,11.3992752 M14.0706788,12.9957842 C13.5634545,12.9957842 13.0995879,12.9090691 12.6784848,12.7344509 C12.2573818,12.5604267 11.8915152,12.3163176 11.5808848,12.0027176 C11.2708485,11.6891176 11.0314909,11.322063 10.8634061,10.9003661 C10.6953212,10.479263 10.6115758,10.0213358 10.6115758,9.52717818 C10.6115758,9.03302061 10.6953212,8.57568727 10.8634061,8.1539903 C11.0314909,7.73288727 11.2708485,7.36523879 11.5808848,7.05163879 C11.8915152,6.73803879 12.2573818,6.49452364 12.6784848,6.31990545 C13.0995879,6.14588121 13.5634545,6.05857212 14.0706788,6.05857212 C14.577903,6.05857212 15.0417697,6.14588121 15.4628727,6.31990545 C15.8839758,6.49452364 16.2498424,6.73803879 16.5604727,7.05163879 C16.871103,7.36523879 17.1098667,7.73288727 17.2779515,8.1539903 C17.4460364,8.57568727 17.5297818,9.03302061 17.5297818,9.52717818 C17.5297818,10.0213358 17.4460364,10.479263 17.2779515,10.9003661 C17.1098667,11.322063 16.871103,11.6891176 16.5604727,12.0027176 C16.2498424,12.3163176 15.8839758,12.5604267 15.4628727,12.7344509 C15.0417697,12.9090691 14.577903,12.9957842 14.0706788,12.9957842"*/}
										{/*				fill="#FFFFFF">*/}
										{/*			</path>*/}
										{/*			<polygon fill="#FFFFFF"*/}
										{/*					 points="8.4639503 12.8342327 6.65837455 13.2666206 6.65837455 7.77862061 4.65323515 7.77862061 4.65323515 6.22012364 10.4690897 6.22012364 10.4690897 7.77862061 8.4639503 7.77862061">*/}
										{/*			</polygon>*/}
										{/*		</svg>*/}
										{/*		#10 in TV Shows Today*/}
										{/*	</div>*/}
										{/*</div>*/}
										<p className="preview-modal-synopsis previewModal--text">
											<div className="ptrack-content">
												{movie.description}
											</div>
										</p>
									</div>
									<div className="previewModal--detailsMetadata-right">
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">Cast:</span>
											{movie?.casts.map((cast, index) => (
												<span className="tag-item" key={index}>
													<a href="/browse/m/person/20048493"> {cast}, </a>
												</span>
											))}
											<span className="tag-more">
												<a href="#about">more</a>
											</span>
										</div>
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">Genres:</span>
											{movie?.genres.map((genre, index) => (
												<span className="tag-item" key={index}>
													<a href="/browse/m/genre/11714"> {genre.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}{index !== movie.genres.length - 1 && <span>,</span>}</a>
												</span>
											))}
										</div>
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">This show is:</span>
											<span className="tag-item">
												<a href="/browse/m/genre/100054"> Sentimental </a>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="ptrack-container">
							<div className="ptrack-content">
								<div className="ptrack-container">
									<div className="moreLikeThis--wrapper">
										<h3 className="previewModal--section-header moreLikeThis--header">
											More Like This
										</h3>
										<div className={`section-container ${collapsed}`}>
											<div className="moreLikeThis--container">
												{movies.map((movie) => (
													<div className="titleCard--container more-like-this-item" role="button">
														<div className="titleCard-imageWrapper has-duration">
															<div className="ptrack-content">
																<img src={movie.media} alt={movie.title}/>
															</div>
															<div className="titleCard-playIcon">
																<svg width="24" height="24" viewBox="0 0 24 24"
																	 fill="none"
																	 xmlns="http://www.w3.org/2000/svg"
																	 className="titleCard-playSVG ltr-4z3qvp e1svuwfo1"
																	 data-name="Play" aria-hidden="true">
																	<path
																		d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
																		fill="currentColor">
																	</path>
																</svg>
															</div>
															<span className="duration ellipsized">1h 45m</span>
														</div>
														<div className="titleCard--metadataWrapper">
															<div>
																<div className="videoMetadata--container-container">
																	<div className="videoMetadata--container titlecard-videoMetadata videoMetadata--two-lines">
																		<div className="videoMetadata--first-line">
																		<span className="match-score-wrapper no-rating">
																			<div className="show-match-score rating-inner">
																				<div className="meta-thumb-container thumb-down">
																					<svg width="24" height="24"
																						 viewBox="0 0 24 24" fill="none"
																						 xmlns="http://www.w3.org/2000/svg"
																						 className="thumb thumb-down-filled svg-icon svg-icon-thumb-thumb-down-filled ltr-4z3qvp e1svuwfo1"
																						 data-name="ThumbsDownFill"
																						 aria-hidden="true">
																						<path fill-rule="evenodd" clip-rule="evenodd"
																							d="M10.593 17.7442L10.687 18.4959C10.8658 19.9265 12.0819 21 13.5236 21C13.7867 21 14 20.7867 14 20.5236V17.2868C14 17.0994 14.0527 16.9157 14.152 16.7568L16.0926 13.6519C16.3548 13.2323 16.7633 12.9248 17.2391 12.7888L19.2747 12.2072C19.704 12.0846 20 11.6922 20 11.2457V5.68387C20 5.30618 19.6938 5 19.3161 5C18.126 5 16.9565 4.68942 15.9232 4.09895L15.75 4C14.6032 3.34469 13.3053 3 11.9844 3H11H8H7.5C6.67157 3 6 3.67157 6 4.5C6 4.88418 6.14443 5.23462 6.38195 5.5H6C5.17157 5.5 4.5 6.17157 4.5 7C4.5 7.53991 4.78525 8.0132 5.21328 8.27737C4.522 8.41118 4 9.01963 4 9.75C4 10.5784 4.67157 11.25 5.5 11.25H5.67055C5.26638 11.5187 5 11.9783 5 12.5C5 13.3284 5.67157 14 6.5 14H10.875L10.593 16.2558C10.5312 16.75 10.5312 17.25 10.593 17.7442Z"
																							fill="currentColor">
																						</path>
																					</svg>
																				</div>
																				<div className="meta-thumb-container thumb-up">
																					<svg width="24" height="24"
																						 viewBox="0 0 24 24" fill="none"
																						 xmlns="http://www.w3.org/2000/svg"
																						 className="thumb thumb-up-filled svg-icon svg-icon-thumb-thumb-up-filled ltr-4z3qvp e1svuwfo1"
																						 data-name="ThumbsUpFill"
																						 aria-hidden="true">
																						<path fill-rule="evenodd" clip-rule="evenodd"
																							  d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z"
																							  fill="currentColor">
																						</path>
																					</svg>
																				</div>
																			</div>
																		</span>
																		</div>
																		<div className="videoMetadata--second-line">
																			<div className="year">{movie.releaseDate.split("-")[2]}</div>
																			<span className="maturity-rating ">
																			<span className="maturity-number">{movie.maturity}</span>
																		</span>
																		</div>
																	</div>
																	<div>
																		<div className="ltr-bjn8wh">
																			<div className="ptrack-content">
																				<button className="color-supplementary hasIcon round ltr-11vo9g5">
																					<div className="ltr-1st24vv">
																						<div className="small ltr-iyulz3">
																							<svg width="24" height="24"
																								 viewBox="0 0 24 24"
																								 fill="none"
																								 xmlns="http://www.w3.org/2000/svg"
																								 className="ltr-4z3qvp e1svuwfo1"
																								 data-name="Plus"
																								 aria-hidden="true">
																								<path
																									fill-rule="evenodd"
																									clip-rule="evenodd"
																									d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
																									fill="currentColor">
																								</path>
																							</svg>
																						</div>
																					</div>
																				</button>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
															<p className="titleCard-synopsis previewModal--small-text">
																<div className="ptrack-container">
																	<div className="ptrack-content">
																		{movie.tagline}
																	</div>
																</div>
															</p>
														</div>
													</div>
												))}
											</div>
										</div>
										<div className={`section-divider ${collapsed}`}>
											<button className="color-supplementary section-expandButton hasIcon round ltr-11vo9g5" onClick={() => setCollapsed(collapsed === "collapsed" ? "" : "collapsed")}>
												<div className="ltr-1st24vv">
													<div className="small ltr-iyulz3">
														{collapsed === "collapsed" ? (
															<svg width="24" height="24" viewBox="0 0 24 24"
																 fill="none"
																 xmlns="http://www.w3.org/2000/svg"
																 className="ltr-4z3qvp e1svuwfo1"
																 data-name="ChevronDown" aria-hidden="true">
																<path fill-rule="evenodd" clip-rule="evenodd"
																	  d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z"
																	  fill="currentColor"></path>
															</svg>
														) : (
															<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
																 xmlns="http://www.w3.org/2000/svg"
																 className="ltr-4z3qvp e1svuwfo1" data-name="ChevronUp"
																 aria-hidden="true">
																<path fill-rule="evenodd" clip-rule="evenodd"
																	  d="M12 8.41409L19.2929 15.707L20.7071 14.2928L12.7071 6.29277C12.5196 6.10523 12.2652 5.99988 12 5.99988C11.7348 5.99988 11.4804 6.10523 11.2929 6.29277L3.29291 14.2928L4.70712 15.707L12 8.41409Z"
																	  fill="currentColor"></path>
															</svg>
														)}
													</div>
												</div>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="ptrack-container">
							<div className="ptrack-content">
								<div className="about-wrapper">
									<div className="about-header">
										<h3 className="previewModal--section-header">
											About <strong>{movie.title}</strong>
										</h3>
									</div>
									<div className="about-container">
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">Creators:</span>
											<span className="tag-item">
												<a href=""> {movie.director}</a>
											</span>
										</div>
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">Cast:</span>
											{movie?.casts.map((cast, index) => (
												<span className="tag-item" key={index}>
													<a href=""> {cast}{index !== movie.casts.length - 1 && <span>,</span>} </a>
												</span>
											))}
										</div>
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">Genres:</span>
											{movie?.genres.map((genre, index) => (
												<span className="tag-item" key={index}>
													<a href=""> {genre.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}{index !== movie.genres.length - 1 && <span>,</span>}</a>
												</span>
											))}
										</div>
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">This Movie is:</span>
											{movie?.keywords.map((keyword, index) => (
												<span className="tag-item" key={index}>
													<a href="/browse/m/genre/100054"> {keyword}{index !== movie.keywords.length - 1 && <span>,</span>} </a>
												</span>
											))}
										</div>
										<div className="maturity-rating-wrapper">
											<span className="title">Maturity rating:</span>
											<span className="maturity-rating ">
												<a href="" className="maturity-number">{movie.maturity}</a>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	);
}

export default MoreMovieInfo;