import React, {useContext, useEffect, useRef, useState} from "react";

import "./MoreMovieInfo.css";
import {useModal} from "../../context/Modal";
import {NavLink, useHistory} from "react-router-dom";
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
	const history = useHistory()
	const movies = Object.values(useSelector((state) => state.movies));
	const [videoEnded, setVideoEnded] = useState(false);
	let [superLiked, setSuperLiked] = useState(false);
	let [liked, setLiked] = useState(false);
	let [disliked, setDisliked] = useState(false);

	let [watchLater, setWatchLater] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [collapsed, setCollapsed] = useState("collapsed");
	const [isMuted, setIsMuted] = useState(false);

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

	const handleToggleMute = () => {
		setIsMuted(!isMuted);
	};

	if (updatedProfile.profileRatings) {
		for (let ratingObj of updatedProfile.profileRatings) {
			const {rating, movie: movieObj} = ratingObj;
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
		closeModal()
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

	const currentMovieGenres = movie.genres
	const currentMovieId = movie.movieId

	const similarMovies = movies.filter((movie) => {
		return (
			movie.movieId !== currentMovieId &&
			currentMovieGenres.every((genre) => movie.genres.includes(genre))
		);
	});

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
		<div className="focus-trap-wrapper previewModal--wrapper detail-modal has-smaller-buttons">
			<div className="previewModal--container detail-modal has-smaller-buttons"
				 style={{width: "1107.06px", top: "542px", left: "auto", transformOrigin: "center top 0px", transform: "translateX(0px) translateY(calc(2em - 542px)) scaleX(1) scaleY(1) translateZ(0px)",boxShadow: "rgba(0, 0, 0, 0.75) 0px 3px 10px", zIndex: 2, opacity: 1, marginBottom: "2em", minWidth: "850px"}}>
				<div className="previewModal--player_container detail-modal has-smaller-buttons">
					<div style={{position: "absolute", width: "100%", height: "100%",overflow: "hidden"}}>
						<div style={{position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
							<video style={{position: "absolute", width: "100%", height: "100%", objectFit: "cover"}}
								   src={movie?.trailer}
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
						<img src={movie.backdrop} alt={movie.title} className="playerModel--player__storyArt detail-modal has-smaller-buttons" style={{opacity: 1}}/>
						{/*)}*/}
						{/*<img alt="" src="" style={{display: "none"}}/>*/}
					</div>
					<div style={{opacity: 1}}>
						<div className="previewModal--player-titleTreatmentWrapper" style={{opacity: 1}}>
							<div className="previewModal--player-titleTreatment-left previewModal--player-titleTreatment detail-modal has-smaller-buttons detail-modal has-smaller-buttons">
								<img alt="" src="https://occ-0-616-621.1.nflxso.net/dnm/api/v6/tx1O544a9T7n8Z_G12qaboulQQE/AAAABYl2xd1rM_KgFFzuWQq0jMp3bO0PTSOds90-7LA4xP74zuqDu-nklU8Cj1izisKKmOzUXIhjCXKY_wgxPahYYP6cphU6LGQERC7PERdnwlI.png?r=317" style={{display: "none"}}/>
								{/*<h1 className="previewModal--player-titleTreatment-logo" style={{width: "100%", opacity: 1, fontSize: "3rem", fontWeight:400, whiteSpace: "nowrap"}} >{movie.title}</h1>*/}
								<img className="previewModal--player-titleTreatment-logo" alt="" src={movie.titleImage} style={{width: "70%", opacity: 1}}/>
								<div className="buttonControls--container" data-uia="mini-modal-controls">
									<NavLink exact to={`/watch/${movie.movieId}`} className="primary-button playLink isToolkit" onClick={() => closeModal()}>
										<button className="color-primary hasLabel hasIcon ltr-podnco" onClick={() => handleViewed(movie)}>
											<div className="ltr-1st24vv">
												<div className="medium ltr-iyulz3">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-hidden="true">
														<path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
															fill="currentColor">
														</path>
													</svg>
												</div>
											</div>
											<div className="ltr-1npqywr" style={{width: "1rem"}}></div>
											<span className="ltr-1vh9doa">Play</span>
										</button>
									</NavLink>
									<div className="ltr-bjn8wh">
										<div className="ptrack-content">
											<button className="color-supplementary hasIcon round ltr-11vo9g5" onClick={() => handleWatchLaterMovie(movie)}>
												<div className="ltr-1st24vv">
													<div className="small ltr-iyulz3">
														{watchLater ?
															<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
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
										<div className={`thumbs-selection-overlay-container ltr-1f3e9vp ${showMenu ? 'visible' : ''}`}
											 style={{opacity: 1, transform: "translateX(-50%) translateY(-50%) scale(1) translateZ(0px)"}} ref={likedRef} onMouseLeave={closeMenu}>
											<div id="thumbs-selection-menu">
												<div>
													<div className="ltr-73ot9c">
														<div className="ltr-bjn8wh">
															<div style={{opacity: 1, transform: "none"}}>
																<button className="color-supplementary small round ltr-8h50qn" data-uia="thumbs-down-button" id="thumbs-selection-down" onClick={() => handleRating("dislike", movie)}>
																	{disliked ?
																	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72" style={{width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)"}} preserveAspectRatio="xMidYMid meet">
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
																							  d=" M-1.312999963760376,6.495999813079834 C-1.312999963760376,6.495999813079834 -1.406999945640564,5.74399995803833 -1.406999945640564,5.74399995803833 C-1.468999981880188,5.25 -1.468999981880188,4.75 -1.406999945640564,4.25600004196167 C-1.406999945640564,4.25600004196167 -1.125,2 -1.125,2 C-1.125,2 -5.5,2 -5.5,2 C-6.328000068664551,2 -7,1.3279999494552612 -7,0.5 C-7,-0.02199999988079071 -6.732999801635742,-0.48100000619888306 -6.328999996185303,-0.75 C-6.328999996185303,-0.75 -6.5,-0.75 -6.5,-0.75 C-7.328000068664551,-0.75 -8,-1.4220000505447388 -8,-2.25 C-8,-2.9800000190734863 -7.478000164031982,-3.5889999866485596 -6.7870001792907715,-3.7230000495910645 C-7.215000152587891,-3.986999988555908 -7.5,-4.460000038146973 -7.5,-5 C-7.5,-5.828000068664551 -6.828000068664551,-6.5 -6,-6.5 C-6,-6.5 -5.618000030517578,-6.5 -5.618000030517578,-6.5 C-5.855999946594238,-6.764999866485596 -6,-7.116000175476074 -6,-7.5 C-6,-8.32800006866455 -5.328000068664551,-9 -4.5,-9 C-4.5,-9 -0.01600000075995922,-9 -0.01600000075995922,-9 C1.3049999475479126,-9 2.6029999256134033,-8.654999732971191 3.75,-8 C3.75,-8 3.9230000972747803,-7.901000022888184 3.9230000972747803,-7.901000022888184 C4.955999851226807,-7.310999870300293 6.125999927520752,-7 7.315999984741211,-7 C7.693999767303467,-7 8,-6.693999767303467 8,-6.315999984741211 C8,-6.315999984741211 8,-0.7540000081062317 8,-0.7540000081062317 C8,-0.30799999833106995 7.703999996185303,0.08399999886751175 7.275000095367432,0.2070000022649765 C7.275000095367432,0.2070000022649765 5.238999843597412,0.7889999747276306 5.238999843597412,0.7889999747276306 C4.763000011444092,0.925000011920929 4.355000019073486,1.2319999933242798 4.0929999351501465,1.6519999504089355 C4.0929999351501465,1.6519999504089355 2.1519999504089355,4.756999969482422 2.1519999504089355,4.756999969482422 C2.052999973297119,4.915999889373779 2,5.099999904632568 2,5.2870001792907715 C2,5.2870001792907715 2,8.52400016784668 2,8.52400016784668 C2,8.786999702453613 1.7869999408721924,9 1.5240000486373901,9 C0.0820000022649765,9 -1.1339999437332153,7.927000045776367 -1.312999963760376,6.495999813079834z">
																						</path>
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
																							  d=" M1.25,4.2870001792907715 C1.25,3.9119999408721924 1.3550000190734863,3.5450000762939453 1.5540000200271606,3.2269999980926514 C1.5540000200271606,3.2269999980926514 3.494999885559082,0.12200000137090683 3.494999885559082,0.12200000137090683 C3.888000011444092,-0.5070000290870667 4.5,-0.968999981880188 5.214000225067139,-1.1729999780654907 C5.214000225067139,-1.1729999780654907 7.25,-1.753999948501587 7.25,-1.753999948501587 C7.25,-1.753999948501587 7.25,-6.5 7.25,-6.5 C6.133999824523926,-6.505000114440918 5.025000095367432,-6.686999797821045 3.9660000801086426,-7.039999961853027 C3.9660000801086426,-7.039999961853027 2.4730000495910645,-7.538000106811523 2.4730000495910645,-7.538000106811523 C1.5549999475479126,-7.843999862670898 0.593999981880188,-8 -0.37299999594688416,-8 C-0.37299999594688416,-8 -4.25,-8 -4.25,-8 C-5.078000068664551,-8 -5.75,-7.328000068664551 -5.75,-6.5 C-5.75,-6.5 -5.75,-6.000999927520752 -5.75,-6.000999927520752 C-5.75,-6.000999927520752 -6.14900016784668,-5.701000213623047 -6.14900016784668,-5.701000213623047 C-6.515999794006348,-5.426000118255615 -6.75,-4.989999771118164 -6.75,-4.5 C-6.75,-4.4070000648498535 -6.742000102996826,-4.316999912261963 -6.72599983215332,-4.230000019073486 C-6.72599983215332,-4.230000019073486 -6.644999980926514,-3.7850000858306885 -6.644999980926514,-3.7850000858306885 C-6.644999980926514,-3.7850000858306885 -6.926000118255615,-3.430999994277954 -6.926000118255615,-3.430999994277954 C-7.129000186920166,-3.174999952316284 -7.25,-2.8529999256134033 -7.25,-2.5 C-7.25,-2.1470000743865967 -7.129000186920166,-1.8250000476837158 -6.926000118255615,-1.569000005722046 C-6.926000118255615,-1.569000005722046 -6.644999980926514,-1.215000033378601 -6.644999980926514,-1.215000033378601 C-6.644999980926514,-1.215000033378601 -6.72599983215332,-0.7699999809265137 -6.72599983215332,-0.7699999809265137 C-6.742000102996826,-0.6830000281333923 -6.75,-0.5929999947547913 -6.75,-0.5 C-6.75,0.328000009059906 -6.078000068664551,1 -5.25,1 C-5.25,1 -1.180999994277954,1 -1.180999994277954,1 C-1.180999994277954,1 -1.503999948501587,2.25 -1.503999948501587,2.25 C-1.6480000019073486,2.808000087738037 -1.75,3.4149999618530273 -1.75,4 C-1.75,4.7729997634887695 -1.5729999542236328,5.7729997634887695 -1.3569999933242798,6.689000129699707 C-1.1779999732971191,7.447000026702881 -0.4650000035762787,8 0.41200000047683716,8 C0.41200000047683716,8 1.25,8 1.25,8 C1.25,8 1.25,4.2870001792907715 1.25,4.2870001792907715z M3.25,8.5 C3.25,9.32800006866455 2.578000068664551,10 1.75,10 C1.75,10 0.41200000047683716,10 0.41200000047683716,10 C-1.2929999828338623,10 -2.890000104904175,8.902999877929688 -3.303999900817871,7.1479997634887695 C-3.5290000438690186,6.193999767303467 -3.75,5.011000156402588 -3.75,4 C-3.75,3.6600000858306885 -3.7249999046325684,3.3239998817443848 -3.684000015258789,3 C-3.684000015258789,3 -5.25,3 -5.25,3 C-7.183000087738037,3 -8.75,1.4329999685287476 -8.75,-0.5 C-8.75,-0.5630000233650208 -8.748000144958496,-0.6259999871253967 -8.744999885559082,-0.6880000233650208 C-9.0649995803833,-1.2170000076293945 -9.25,-1.8380000591278076 -9.25,-2.5 C-9.25,-3.1619999408721924 -9.0649995803833,-3.7829999923706055 -8.744999885559082,-4.311999797821045 C-8.748000144958496,-4.374000072479248 -8.75,-4.436999797821045 -8.75,-4.5 C-8.75,-5.4710001945495605 -8.354000091552734,-6.349999904632568 -7.7170000076293945,-6.982999801635742 C-7.48199987411499,-8.687999725341797 -6.019000053405762,-10 -4.25,-10 C-4.25,-10 -0.37299999594688416,-10 -0.37299999594688416,-10 C0.8090000152587891,-10 1.9839999675750732,-9.8100004196167 3.1059999465942383,-9.435999870300293 C3.1059999465942383,-9.435999870300293 4.598999977111816,-8.937999725341797 4.598999977111816,-8.937999725341797 C5.468999862670898,-8.64799976348877 6.380000114440918,-8.5 7.296999931335449,-8.5 C8.37600040435791,-8.5 9.25,-7.625999927520752 9.25,-6.546999931335449 C9.25,-6.546999931335449 9.25,-1.753999948501587 9.25,-1.753999948501587 C9.25,-0.8610000014305115 8.657999992370605,-0.07599999755620956 7.798999786376953,0.16899999976158142 C7.798999786376953,0.16899999976158142 5.763999938964844,0.75 5.763999938964844,0.75 C5.526000022888184,0.8180000185966492 5.322000026702881,0.972000002861023 5.190999984741211,1.1820000410079956 C5.190999984741211,1.1820000410079956 3.25,4.2870001792907715 3.25,4.2870001792907715 C3.25,4.2870001792907715 3.25,8.5 3.25,8.5z">
																						</path>
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
																					<g opacity="1"
																					   transform="matrix(1,0,0,1,0,0)">
																						<path fill="rgb(255,255,255)" fill-opacity="1"
																							  d=" M1.312999963760376,-6.495999813079834 C1.312999963760376,-6.495999813079834 1.406999945640564,-5.74399995803833 1.406999945640564,-5.74399995803833 C1.468999981880188,-5.25 1.468999981880188,-4.75 1.406999945640564,-4.25600004196167 C1.406999945640564,-4.25600004196167 1.125,-2 1.125,-2 C1.125,-2 5.5,-2 5.5,-2 C6.328000068664551,-2 7,-1.3279999494552612 7,-0.5 C7,0.02199999988079071 6.732999801635742,0.48100000619888306 6.328999996185303,0.75 C6.328999996185303,0.75 6.5,0.75 6.5,0.75 C7.328000068664551,0.75 8,1.4220000505447388 8,2.25 C8,2.9800000190734863 7.478000164031982,3.5889999866485596 6.7870001792907715,3.7230000495910645 C7.215000152587891,3.986999988555908 7.5,4.460000038146973 7.5,5 C7.5,5.828000068664551 6.828000068664551,6.5 6,6.5 C6,6.5 5.618000030517578,6.5 5.618000030517578,6.5 C5.855999946594238,6.764999866485596 6,7.116000175476074 6,7.5 C6,8.32800006866455 5.328000068664551,9 4.5,9 C4.5,9 0.01600000075995922,9 0.01600000075995922,9 C-1.3049999475479126,9 -2.6029999256134033,8.654999732971191 -3.75,8 C-3.75,8 -3.9230000972747803,7.901000022888184 -3.9230000972747803,7.901000022888184 C-4.955999851226807,7.310999870300293 -6.125999927520752,7 -7.315999984741211,7 C-7.693999767303467,7 -8,6.693999767303467 -8,6.315999984741211 C-8,6.315999984741211 -8,0.7540000081062317 -8,0.7540000081062317 C-8,0.30799999833106995 -7.703999996185303,-0.08399999886751175 -7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -5.238999843597412,-0.7889999747276306 -5.238999843597412,-0.7889999747276306 C-4.763000011444092,-0.925000011920929 -4.355000019073486,-1.2319999933242798 -4.0929999351501465,-1.6519999504089355 C-4.0929999351501465,-1.6519999504089355 -2.1519999504089355,-4.756999969482422 -2.1519999504089355,-4.756999969482422 C-2.052999973297119,-4.915999889373779 -2,-5.099999904632568 -2,-5.2870001792907715 C-2,-5.2870001792907715 -2,-8.52400016784668 -2,-8.52400016784668 C-2,-8.786999702453613 -1.7869999408721924,-9 -1.5240000486373901,-9 C-0.0820000022649765,-9 1.1339999437332153,-7.927000045776367 1.312999963760376,-6.495999813079834z">
																						</path>
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
																						  d=" M-1.25,-4.2870001792907715 C-1.25,-3.9119999408721924 -1.3550000190734863,-3.5450000762939453 -1.5540000200271606,-3.2269999980926514 C-1.5540000200271606,-3.2269999980926514 -3.494999885559082,-0.12200000137090683 -3.494999885559082,-0.12200000137090683 C-3.888000011444092,0.5070000290870667 -4.5,0.968999981880188 -5.214000225067139,1.1729999780654907 C-5.214000225067139,1.1729999780654907 -7.25,1.753999948501587 -7.25,1.753999948501587 C-7.25,1.753999948501587 -7.25,6.5 -7.25,6.5 C-6.133999824523926,6.505000114440918 -5.025000095367432,6.686999797821045 -3.9660000801086426,7.039999961853027 C-3.9660000801086426,7.039999961853027 -2.4730000495910645,7.538000106811523 -2.4730000495910645,7.538000106811523 C-1.5549999475479126,7.843999862670898 -0.593999981880188,8 0.37299999594688416,8 C0.37299999594688416,8 4.25,8 4.25,8 C5.078000068664551,8 5.75,7.328000068664551 5.75,6.5 C5.75,6.5 5.75,6.000999927520752 5.75,6.000999927520752 C5.75,6.000999927520752 6.14900016784668,5.701000213623047 6.14900016784668,5.701000213623047 C6.515999794006348,5.426000118255615 6.75,4.989999771118164 6.75,4.5 C6.75,4.4070000648498535 6.742000102996826,4.316999912261963 6.72599983215332,4.230000019073486 C6.72599983215332,4.230000019073486 6.644999980926514,3.7850000858306885 6.644999980926514,3.7850000858306885 C6.644999980926514,3.7850000858306885 6.926000118255615,3.430999994277954 6.926000118255615,3.430999994277954 C7.129000186920166,3.174999952316284 7.25,2.8529999256134033 7.25,2.5 C7.25,2.1470000743865967 7.129000186920166,1.8250000476837158 6.926000118255615,1.569000005722046 C6.926000118255615,1.569000005722046 6.644999980926514,1.215000033378601 6.644999980926514,1.215000033378601 C6.644999980926514,1.215000033378601 6.72599983215332,0.7699999809265137 6.72599983215332,0.7699999809265137 C6.742000102996826,0.6830000281333923 6.75,0.5929999947547913 6.75,0.5 C6.75,-0.328000009059906 6.078000068664551,-1 5.25,-1 C5.25,-1 1.180999994277954,-1 1.180999994277954,-1 C1.180999994277954,-1 1.503999948501587,-2.25 1.503999948501587,-2.25 C1.6480000019073486,-2.808000087738037 1.75,-3.4149999618530273 1.75,-4 C1.75,-4.7729997634887695 1.5729999542236328,-5.7729997634887695 1.3569999933242798,-6.689000129699707 C1.1779999732971191,-7.447000026702881 0.4650000035762787,-8 -0.41200000047683716,-8 C-0.41200000047683716,-8 -1.25,-8 -1.25,-8 C-1.25,-8 -1.25,-4.2870001792907715 -1.25,-4.2870001792907715z M-3.25,-8.5 C-3.25,-9.32800006866455 -2.578000068664551,-10 -1.75,-10 C-1.75,-10 -0.41200000047683716,-10 -0.41200000047683716,-10 C1.2929999828338623,-10 2.890000104904175,-8.902999877929688 3.303999900817871,-7.1479997634887695 C3.5290000438690186,-6.193999767303467 3.75,-5.011000156402588 3.75,-4 C3.75,-3.6600000858306885 3.7249999046325684,-3.3239998817443848 3.684000015258789,-3 C3.684000015258789,-3 5.25,-3 5.25,-3 C7.183000087738037,-3 8.75,-1.4329999685287476 8.75,0.5 C8.75,0.5630000233650208 8.748000144958496,0.6259999871253967 8.744999885559082,0.6880000233650208 C9.0649995803833,1.2170000076293945 9.25,1.8380000591278076 9.25,2.5 C9.25,3.1619999408721924 9.0649995803833,3.7829999923706055 8.744999885559082,4.311999797821045 C8.748000144958496,4.374000072479248 8.75,4.436999797821045 8.75,4.5 C8.75,5.4710001945495605 8.354000091552734,6.349999904632568 7.7170000076293945,6.982999801635742 C7.48199987411499,8.687999725341797 6.019000053405762,10 4.25,10 C4.25,10 0.37299999594688416,10 0.37299999594688416,10 C-0.8090000152587891,10 -1.9839999675750732,9.8100004196167 -3.1059999465942383,9.435999870300293 C-3.1059999465942383,9.435999870300293 -4.598999977111816,8.937999725341797 -4.598999977111816,8.937999725341797 C-5.468999862670898,8.64799976348877 -6.380000114440918,8.5 -7.296999931335449,8.5 C-8.37600040435791,8.5 -9.25,7.625999927520752 -9.25,6.546999931335449 C-9.25,6.546999931335449 -9.25,1.753999948501587 -9.25,1.753999948501587 C-9.25,0.8610000014305115 -8.657999992370605,0.07599999755620956 -7.798999786376953,-0.16899999976158142 C-7.798999786376953,-0.16899999976158142 -5.763999938964844,-0.75 -5.763999938964844,-0.75 C-5.526000022888184,-0.8180000185966492 -5.322000026702881,-0.972000002861023 -5.190999984741211,-1.1820000410079956 C-5.190999984741211,-1.1820000410079956 -3.25,-4.2870001792907715 -3.25,-4.2870001792907715 C-3.25,-4.2870001792907715 -3.25,-8.5 -3.25,-8.5z">
																					</path>
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
																<button aria-label="Rate two thumbs up" className="color-supplemental small round ltr-8h50qn" onClick={() => handleRating("superlike", movie)}>
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
																									d=" M7.400000095367432,5.539999961853027 C7.388999938964844,5.567999839782715 7.376999855041504,5.59499979019165 7.364999771118164,5.622000217437744 M-7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -7.823999881744385,-2.130000114440918 -7.823999881744385,-2.130000114440918 M-3.75,8 C-3.75,8 -4.742000102996826,9.736000061035156 -4.742000102996826,9.736000061035156 M-4.742000102996826,9.736000061035156 C-4.742000102996826,9.736000061035156 -4.914999961853027,9.637999534606934 -4.914999961853027,9.637999534606934 C-5.645999908447266,9.220000267028809 -6.473999977111816,9 -7.315999984741211,9 C-8.79800033569336,9 -10,7.797999858856201 -10,6.315999984741211 C-10,6.315999984741211 -10,0.7540000081062317 -10,0.7540000081062317 C-10,-0.5849999785423279 -9.112000465393066,-1.7619999647140503 -7.823999881744385,-2.130000114440918 C-7.823999881744385,-2.130000114440918 -5.789000034332275,-2.7119998931884766 -5.789000034332275,-2.7119998931884766 C-5.789000034332275,-2.7119998931884766 -4,-5.573999881744385 -4,-5.573999881744385 C-4,-5.573999881744385 -4,-8.52400016784668 -4,-8.52400016784668 C-4,-9.892000198364258 -2.8919999599456787,-11 -1.5240000486373901,-11 C0.9259999990463257,-11 2.99399995803833,-9.175000190734863 3.2980000972747803,-6.74399995803833 C3.2980000972747803,-6.74399995803833 3.375999927520752,-6.116000175476074 3.375999927520752,-6.116000175476074 C3.4639999866485596,-5.413000106811523 3.4579999446868896,-4.701000213623047 3.3589999675750732,-4 C3.3589999675750732,-4 5.5,-4 5.5,-4 C7.433000087738037,-4 9,-2.433000087738037 9,-0.5 C9,-0.40299999713897705 8.996000289916992,-0.3059999942779541 8.98799991607666,-0.210999995470047 C9.61400032043457,0.42100000381469727 10,1.2899999618530273 10,2.25 C10,2.9719998836517334 9.781999588012695,3.6419999599456787 9.407999992370605,4.198999881744385 C9.468000411987305,4.455999851226807 9.5,4.723999977111816 9.5,5 C9.5,6.198999881744385 8.89799976348877,7.25600004196167 7.979000091552734,7.88700008392334 C7.785999774932861,9.637999534606934 6.302000045776367,11 4.5,11 C4.5,11 0.01600000075995922,11 0.01600000075995922,11 C-1.652999997138977,11 -3.2929999828338623,10.564000129699707 -4.742000102996826,9.736000061035156z">
																								</path>
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
																								  d=" M-2.75,-12 C-2.75,-12 -1.4119999408721924,-12 -1.4119999408721924,-12 C1.121000051498413,-12 3.6019999980926514,-10.359000205993652 4.250999927520752,-7.60699987411499 C4.423999786376953,-6.870999813079834 4.614999771118164,-5.929999828338623 4.702000141143799,-4.98199987411499 C7.426000118255615,-4.760000228881836 9.588000297546387,-2.553999900817871 9.741000175476074,0.1889999955892563 C10.067000389099121,0.8930000066757202 10.25,1.6770000457763672 10.25,2.5 C10.25,3.3239998817443848 10.067000389099121,4.10699987411499 9.741000175476074,4.810999870300293 C9.675999641418457,5.9770002365112305 9.246999740600586,7.046000003814697 8.569000244140625,7.90500020980835 C7.947999954223633,10.26200008392334 5.802000045776367,12 3.25,12 C3.25,12 -0.34599998593330383,12 -0.34599998593330383,12 C-2.007999897003174,12 -3.6540000438690186,11.661999702453613 -5.182000160217285,11.006999969482422 C-5.182000160217285,11.006999969482422 -6.005000114440918,10.654999732971191 -6.005000114440918,10.654999732971191 C-6.243000030517578,10.553000450134277 -6.5,10.5 -6.758999824523926,10.5 C-8.687000274658203,10.5 -10.25,8.937000274658203 -10.25,7.008999824523926 C-10.25,7.008999824523926 -10.25,1.6180000305175781 -10.25,1.6180000305175781 C-10.25,0.10300000011920929 -9.394000053405762,-1.281999945640564 -8.038999557495117,-1.9600000381469727 C-8.038999557495117,-1.9600000381469727 -7.486000061035156,-2.2360000610351562 -7.486000061035156,-2.2360000610351562 C-7.486000061035156,-2.2360000610351562 -6.25,-4.708000183105469 -6.25,-4.708000183105469 C-6.25,-4.708000183105469 -6.25,-8.5 -6.25,-8.5 C-6.25,-10.432999610900879 -4.683000087738037,-12 -2.75,-12z">
																							</path>
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
																							  d=" M1.312999963760376,-6.495999813079834 C1.312999963760376,-6.495999813079834 1.3919999599456787,-5.868000030517578 1.3919999599456787,-5.868000030517578 C1.4639999866485596,-5.291999816894531 1.4509999752044678,-4.709000110626221 1.3559999465942383,-4.13700008392334 C1.3559999465942383,-4.13700008392334 1,-2 1,-2 C1,-2 5.5,-2 5.5,-2 C6.328000068664551,-2 7,-1.3279999494552612 7,-0.5 C7,0.02199999988079071 6.732999801635742,0.48100000619888306 6.328999996185303,0.75 C6.328999996185303,0.75 6.5,0.75 6.5,0.75 C7.328000068664551,0.75 8,1.4220000505447388 8,2.25 C8,2.9800000190734863 7.478000164031982,3.5889999866485596 6.7870001792907715,3.7230000495910645 C7.215000152587891,3.986999988555908 7.5,4.460000038146973 7.5,5 C7.5,5.828000068664551 6.828000068664551,6.5 6,6.5 C6,6.5 5.618000030517578,6.5 5.618000030517578,6.5 C5.855999946594238,6.764999866485596 6,7.116000175476074 6,7.5 C6,8.32800006866455 5.328000068664551,9 4.5,9 C4.5,9 0.01600000075995922,9 0.01600000075995922,9 C-1.3049999475479126,9 -2.6029999256134033,8.654999732971191 -3.75,8 C-3.75,8 -3.9230000972747803,7.901000022888184 -3.9230000972747803,7.901000022888184 C-4.955999851226807,7.310999870300293 -6.125999927520752,7 -7.315999984741211,7 C-7.693999767303467,7 -8,6.693999767303467 -8,6.315999984741211 C-8,6.315999984741211 -8,0.7540000081062317 -8,0.7540000081062317 C-8,0.30799999833106995 -7.703999996185303,-0.08399999886751175 -7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -5.238999843597412,-0.7889999747276306 -5.238999843597412,-0.7889999747276306 C-4.763000011444092,-0.925000011920929 -4.355000019073486,-1.2319999933242798 -4.0929999351501465,-1.6519999504089355 C-4.0929999351501465,-1.6519999504089355 -2.1519999504089355,-4.756999969482422 -2.1519999504089355,-4.756999969482422 C-2.052999973297119,-4.915999889373779 -2,-5.099999904632568 -2,-5.2870001792907715 C-2,-5.2870001792907715 -2,-8.52400016784668 -2,-8.52400016784668 C-2,-8.786999702453613 -1.7869999408721924,-9 -1.5240000486373901,-9 C-0.0820000022649765,-9 1.1339999437332153,-7.927000045776367 1.312999963760376,-6.495999813079834z">
																						</path>
																					</g>
																				</g>
																			</g>
																			<g style={{display: "block"}}
																			   transform="matrix(1,0,0,1,31.48900032043457,37.26300048828125)" opacity="1">
																				<g opacity="1" transform="matrix(1,0,0,1,0,0)">
																					<path fill="rgb(255,255,255)" fill-opacity="1"
																						  d=" M1.312999963760376,-6.495999813079834 C1.312999963760376,-6.495999813079834 1.3919999599456787,-5.868000030517578 1.3919999599456787,-5.868000030517578 C1.4639999866485596,-5.291999816894531 1.4509999752044678,-4.709000110626221 1.3559999465942383,-4.13700008392334 C1.3559999465942383,-4.13700008392334 1,-2 1,-2 C1,-2 5.5,-2 5.5,-2 C6.328000068664551,-2 7,-1.3279999494552612 7,-0.5 C7,0.02199999988079071 6.732999801635742,0.48100000619888306 6.328999996185303,0.75 C6.328999996185303,0.75 6.5,0.75 6.5,0.75 C7.328000068664551,0.75 8,1.4220000505447388 8,2.25 C8,2.9800000190734863 7.478000164031982,3.5889999866485596 6.7870001792907715,3.7230000495910645 C7.215000152587891,3.986999988555908 7.5,4.460000038146973 7.5,5 C7.5,5.828000068664551 6.828000068664551,6.5 6,6.5 C6,6.5 5.618000030517578,6.5 5.618000030517578,6.5 C5.855999946594238,6.764999866485596 6,7.116000175476074 6,7.5 C6,8.32800006866455 5.328000068664551,9 4.5,9 C4.5,9 0.01600000075995922,9 0.01600000075995922,9 C-1.3049999475479126,9 -2.6029999256134033,8.654999732971191 -3.75,8 C-3.75,8 -3.9230000972747803,7.901000022888184 -3.9230000972747803,7.901000022888184 C-4.955999851226807,7.310999870300293 -6.125999927520752,7 -7.315999984741211,7 C-7.693999767303467,7 -8,6.693999767303467 -8,6.315999984741211 C-8,6.315999984741211 -8,0.7540000081062317 -8,0.7540000081062317 C-8,0.30799999833106995 -7.703999996185303,-0.08399999886751175 -7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -5.238999843597412,-0.7889999747276306 -5.238999843597412,-0.7889999747276306 C-4.763000011444092,-0.925000011920929 -4.355000019073486,-1.2319999933242798 -4.0929999351501465,-1.6519999504089355 C-4.0929999351501465,-1.6519999504089355 -2.1519999504089355,-4.756999969482422 -2.1519999504089355,-4.756999969482422 C-2.052999973297119,-4.915999889373779 -2,-5.099999904632568 -2,-5.2870001792907715 C-2,-5.2870001792907715 -2,-8.52400016784668 -2,-8.52400016784668 C-2,-8.786999702453613 -1.7869999408721924,-9 -1.5240000486373901,-9 C-0.0820000022649765,-9 1.1339999437332153,-7.927000045776367 1.312999963760376,-6.495999813079834z">
																					</path>
																				</g>
																			</g>
																			<g clip-path="url(#__lottie_element_276)" style={{display: "block"}} transform="matrix(0.15610000491142273,0,0,0.15610000491142273,3.249500274658203,-0.7504997253417969)" opacity="1">
																			</g>
																		</g>
																	</svg>
																		:
																	<svg xmlns="http://www.w3.org/2000/svg"
																		 viewBox="0 0 72 72" width="72" height="72"
																		 style={{width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)"}}
																		 preserveAspectRatio="xMidYMid meet">
																		<defs>
																			<clipPath id="__lottie_element_546">
																				<rect width="72" height="72" x="0" y="0">
																				</rect>
																			</clipPath>
																			<clipPath id="__lottie_element_548">
																				<path d="M0,0 L410,0 L410,410 L0,410z"></path>
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
																								  d=" M7.400000095367432,5.539999961853027 C7.388999938964844,5.567999839782715 7.376999855041504,5.59499979019165 7.364999771118164,5.622000217437744 M-7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -7.823999881744385,-2.130000114440918 -7.823999881744385,-2.130000114440918 M-3.75,8 C-3.75,8 -4.742000102996826,9.736000061035156 -4.742000102996826,9.736000061035156 M-4.742000102996826,9.736000061035156 C-4.742000102996826,9.736000061035156 -4.914999961853027,9.637999534606934 -4.914999961853027,9.637999534606934 C-5.645999908447266,9.220000267028809 -6.473999977111816,9 -7.315999984741211,9 C-8.79800033569336,9 -10,7.797999858856201 -10,6.315999984741211 C-10,6.315999984741211 -10,0.7540000081062317 -10,0.7540000081062317 C-10,-0.5849999785423279 -9.112000465393066,-1.7619999647140503 -7.823999881744385,-2.130000114440918 C-7.823999881744385,-2.130000114440918 -5.789000034332275,-2.7119998931884766 -5.789000034332275,-2.7119998931884766 C-5.789000034332275,-2.7119998931884766 -4,-5.573999881744385 -4,-5.573999881744385 C-4,-5.573999881744385 -4,-8.52400016784668 -4,-8.52400016784668 C-4,-9.892000198364258 -2.8919999599456787,-11 -1.5240000486373901,-11 C0.9259999990463257,-11 2.99399995803833,-9.175000190734863 3.2980000972747803,-6.74399995803833 C3.2980000972747803,-6.74399995803833 3.375999927520752,-6.116000175476074 3.375999927520752,-6.116000175476074 C3.4639999866485596,-5.413000106811523 3.4579999446868896,-4.701000213623047 3.3589999675750732,-4 C3.3589999675750732,-4 5.5,-4 5.5,-4 C7.433000087738037,-4 9,-2.433000087738037 9,-0.5 C9,-0.40299999713897705 8.996000289916992,-0.3059999942779541 8.98799991607666,-0.210999995470047 C9.61400032043457,0.42100000381469727 10,1.2899999618530273 10,2.25 C10,2.9719998836517334 9.781999588012695,3.6419999599456787 9.407999992370605,4.198999881744385 C9.468000411987305,4.455999851226807 9.5,4.723999977111816 9.5,5 C9.5,6.198999881744385 8.89799976348877,7.25600004196167 7.979000091552734,7.88700008392334 C7.785999774932861,9.637999534606934 6.302000045776367,11 4.5,11 C4.5,11 0.01600000075995922,11 0.01600000075995922,11 C-1.652999997138977,11 -3.2929999828338623,10.564000129699707 -4.742000102996826,9.736000061035156z">
																							</path>
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
																								  d=" M-2.75,-12 C-2.75,-12 -1.4119999408721924,-12 -1.4119999408721924,-12 C1.121000051498413,-12 3.6019999980926514,-10.359000205993652 4.250999927520752,-7.60699987411499 C4.423999786376953,-6.870999813079834 4.614999771118164,-5.929999828338623 4.702000141143799,-4.98199987411499 C7.426000118255615,-4.760000228881836 9.588000297546387,-2.553999900817871 9.741000175476074,0.1889999955892563 C10.067000389099121,0.8930000066757202 10.25,1.6770000457763672 10.25,2.5 C10.25,3.3239998817443848 10.067000389099121,4.10699987411499 9.741000175476074,4.810999870300293 C9.675999641418457,5.9770002365112305 9.246999740600586,7.046000003814697 8.569000244140625,7.90500020980835 C7.947999954223633,10.26200008392334 5.802000045776367,12 3.25,12 C3.25,12 -0.34599998593330383,12 -0.34599998593330383,12 C-2.007999897003174,12 -3.6540000438690186,11.661999702453613 -5.182000160217285,11.006999969482422 C-5.182000160217285,11.006999969482422 -6.005000114440918,10.654999732971191 -6.005000114440918,10.654999732971191 C-6.243000030517578,10.553000450134277 -6.5,10.5 -6.758999824523926,10.5 C-8.687000274658203,10.5 -10.25,8.937000274658203 -10.25,7.008999824523926 C-10.25,7.008999824523926 -10.25,1.6180000305175781 -10.25,1.6180000305175781 C-10.25,0.10300000011920929 -9.394000053405762,-1.281999945640564 -8.038999557495117,-1.9600000381469727 C-8.038999557495117,-1.9600000381469727 -7.486000061035156,-2.2360000610351562 -7.486000061035156,-2.2360000610351562 C-7.486000061035156,-2.2360000610351562 -6.25,-4.708000183105469 -6.25,-4.708000183105469 C-6.25,-4.708000183105469 -6.25,-8.5 -6.25,-8.5 C-6.25,-10.432999610900879 -4.683000087738037,-12 -2.75,-12z">
																							</path>
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
																				<g transform="matrix(1,0,0,1,39.81199645996094,33.90599822998047)" opacity="1">
																					<g opacity="1" transform="matrix(1,0,0,1,0,0)">
																						<path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="2"
																							  d=" M-2.75,-9 C-2.75,-9 -1.4119999408721924,-9 -1.4119999408721924,-9 C-0.12099999934434891,-9 1.034999966621399,-8.175000190734863 1.3309999704360962,-6.918000221252441 C1.5509999990463257,-5.982999801635742 1.75,-4.892000198364258 1.75,-4 C1.75,-3.305000066757202 1.628999948501587,-2.6110000610351562 1.472000002861023,-2 C1.472000002861023,-2 4.25,-2 4.25,-2 C5.63100004196167,-2 6.75,-0.8809999823570251 6.75,0.5 C6.75,0.652999997138977 6.736000061035156,0.8029999732971191 6.710000038146973,0.9480000138282776 C7.047999858856201,1.3739999532699585 7.25,1.9140000343322754 7.25,2.5 C7.25,3.0859999656677246 7.047999858856201,3.625999927520752 6.710000038146973,4.052000045776367 C6.736000061035156,4.197000026702881 6.75,4.3470001220703125 6.75,4.5 C6.75,5.317999839782715 6.35699987411499,6.044000148773193 5.75,6.5 C5.75,7.88100004196167 4.63100004196167,9 3.25,9 C3.25,9 -0.34599998593330383,9 -0.34599998593330383,9 C-1.6019999980926514,9 -2.8450000286102295,8.744999885559082 -4,8.25 C-4,8.25 -4.822999954223633,7.896999835968018 -4.822999954223633,7.896999835968018 C-5.434999942779541,7.635000228881836 -6.093999862670898,7.5 -6.758999824523926,7.5 C-7.03000020980835,7.5 -7.25,7.28000020980835 -7.25,7.008999824523926 C-7.25,7.008999824523926 -7.25,1.6180000305175781 -7.25,1.6180000305175781 C-7.25,1.2389999628067017 -7.035999774932861,0.8930000066757202 -6.697000026702881,0.7239999771118164 C-6.697000026702881,0.7239999771118164 -5.8460001945495605,0.2980000078678131 -5.8460001945495605,0.2980000078678131 C-5.459000110626221,0.10400000214576721 -5.145999908447266,-0.20900000631809235 -4.952000141143799,-0.5960000157356262 C-4.952000141143799,-0.5960000157356262 -3.3559999465942383,-3.7890000343322754 -3.3559999465942383,-3.7890000343322754 C-3.2869999408721924,-3.927999973297119 -3.25,-4.080999851226807 -3.25,-4.236000061035156 C-3.25,-4.236000061035156 -3.25,-8.5 -3.25,-8.5 C-3.25,-8.776000022888184 -3.0260000228881836,-9 -2.75,-9z">
																						</path>
																					</g>
																				</g>
																			</g>
																			<g style={{display: "block"}} transform="matrix(1,0,0,1,32.3120002746582,37.90700149536133)" opacity="1">
																				<g opacity="1" transform="matrix(1,0,0,1,0,0)">
																					<path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="2"
																						  d=" M-2.75,-9 C-2.75,-9 -1.4119999408721924,-9 -1.4119999408721924,-9 C-0.12099999934434891,-9 1.034999966621399,-8.175000190734863 1.3309999704360962,-6.918000221252441 C1.5509999990463257,-5.982999801635742 1.75,-4.892000198364258 1.75,-4 C1.75,-3.305000066757202 1.628999948501587,-2.6110000610351562 1.472000002861023,-2 C1.472000002861023,-2 4.25,-2 4.25,-2 C5.63100004196167,-2 6.75,-0.8809999823570251 6.75,0.5 C6.75,0.652999997138977 6.736000061035156,0.8029999732971191 6.710000038146973,0.9480000138282776 C7.047999858856201,1.3739999532699585 7.25,1.9140000343322754 7.25,2.5 C7.25,3.0859999656677246 7.047999858856201,3.625999927520752 6.710000038146973,4.052000045776367 C6.736000061035156,4.197000026702881 6.75,4.3470001220703125 6.75,4.5 C6.75,5.317999839782715 6.35699987411499,6.044000148773193 5.75,6.5 C5.75,7.88100004196167 4.63100004196167,9 3.25,9 C3.25,9 -0.34599998593330383,9 -0.34599998593330383,9 C-1.6019999980926514,9 -2.8450000286102295,8.744999885559082 -4,8.25 C-4,8.25 -4.822999954223633,7.896999835968018 -4.822999954223633,7.896999835968018 C-5.434999942779541,7.635000228881836 -6.093999862670898,7.5 -6.758999824523926,7.5 C-7.03000020980835,7.5 -7.25,7.28000020980835 -7.25,7.008999824523926 C-7.25,7.008999824523926 -7.25,1.6180000305175781 -7.25,1.6180000305175781 C-7.25,1.2389999628067017 -7.035999774932861,0.8930000066757202 -6.697000026702881,0.7239999771118164 C-6.697000026702881,0.7239999771118164 -5.8460001945495605,0.2980000078678131 -5.8460001945495605,0.2980000078678131 C-5.459000110626221,0.10400000214576721 -5.145999908447266,-0.20900000631809235 -4.952000141143799,-0.5960000157356262 C-4.952000141143799,-0.5960000157356262 -3.3559999465942383,-3.7890000343322754 -3.3559999465942383,-3.7890000343322754 C-3.2869999408721924,-3.927999973297119 -3.25,-4.080999851226807 -3.25,-4.236000061035156 C-3.25,-4.236000061035156 -3.25,-8.5 -3.25,-8.5 C-3.25,-8.776000022888184 -3.0260000228881836,-9 -2.75,-9z">
																					</path>
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
								</div>
								<div className="buttonControls--messaging"></div>
							</div>
							<div className="detail-modal has-smaller-buttons previewModal-audioToggle" style={{opacity: "0.4", display: "block"}}>
								<div className="global-supplemental-audio-toggle">
									<button className="color-supplementary hasIcon round ltr-11vo9g5" onClick={handleToggleMute}>
										<div className="ltr-1st24vv">
											<div className="small ltr-iyulz3">
												{isMuted ?
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
													 xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1"
													 data-name="VolumeOff" aria-hidden="true">
													<path fill-rule="evenodd" clip-rule="evenodd"
														  d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z"
														  fill="currentColor">
													</path>
												</svg>
												:
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
													 xmlns="http://www.w3.org/2000/svg"
													 className="ltr-4z3qvp e1svuwfo1" data-name="VolumeHigh"
													 aria-hidden="true">
													<path fill-rule="evenodd" clip-rule="evenodd"
														  d="M24 12C24 8.28693 22.525 4.72597 19.8995 2.10046L18.4853 3.51468C20.7357 5.76511 22 8.81736 22 12C22 15.1826 20.7357 18.2348 18.4853 20.4852L19.8995 21.8995C22.525 19.2739 24 15.713 24 12ZM11 3.99995C11 3.59549 10.7564 3.23085 10.3827 3.07607C10.009 2.92129 9.57889 3.00685 9.29289 3.29285L4.58579 7.99995H1C0.447715 7.99995 0 8.44767 0 8.99995V15C0 15.5522 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0786 10.3827 20.9238C10.7564 20.7691 11 20.4044 11 20V3.99995ZM5.70711 9.70706L9 6.41417V17.5857L5.70711 14.2928L5.41421 14H5H2V9.99995H5H5.41421L5.70711 9.70706ZM16.0001 12C16.0001 10.4087 15.368 8.88254 14.2428 7.75732L12.8285 9.17154C13.5787 9.92168 14.0001 10.9391 14.0001 12C14.0001 13.0608 13.5787 14.0782 12.8285 14.8284L14.2428 16.2426C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92889C18.9462 6.80426 19.9998 9.3478 19.9998 12C19.9998 14.6521 18.9462 17.1957 17.0709 19.071L15.6567 17.6568C17.157 16.1565 17.9998 14.1217 17.9998 12C17.9998 9.87823 17.157 7.8434 15.6567 6.34311L17.0709 4.92889Z"
														  fill="currentColor">
													</path>
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
													<div className="videoMetadata--container">
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
																		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1" data-name="Subtitles" aria-hidden="true">
																			<path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.75C0 1.33579 0.335786 1 0.75 1H15.25C15.6642 1 16 1.33579 16 1.75V12.25C16 12.6642 15.6642 13 15.25 13H12.75V15C12.75 15.2652 12.61 15.5106 12.3817 15.6456C12.1535 15.7806 11.8709 15.785 11.6386 15.6572L6.80736 13H0.75C0.335786 13 0 12.6642 0 12.25V1.75ZM1.5 2.5V11.5H7H7.19264L7.36144 11.5928L11.25 13.7315V12.25V11.5H12H14.5V2.5H1.5ZM6 6.5L3 6.5V5L6 5V6.5ZM13 7.5H10V9H13V7.5ZM3 9V7.5L9 7.5V9L3 9ZM13 5H7V6.5H13V5Z" fill="currentColor">
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
														<span
															className="ltr-1q4vxyr">{keyword}{index !== movie.keywords.length - 1 &&
															<span>,</span>}</span>
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
													<a href="/browse/m/genre/11714"> {genre.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}{index !== movie.genres.length - 1 &&
														<span>,</span>}</a>
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
										<h3 className="previewModal--section-header moreLikeThis--header">More Like This</h3>
										<div className={`section-container ${collapsed}`}>
											<div className="moreLikeThis--container">
												{similarMovies.map((movie) => (
													<div className="titleCard--container more-like-this-item" role="button">
														<div className="titleCard-imageWrapper has-duration">
															<div className="ptrack-content">
																<img src={movie.backdrop} alt={movie.title}/>
																<div style={{
																	opacity: 1,
																	position: "absolute",
																	bottom: 0,
																	marginLeft: "10px", marginBottom: "10px"
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
															<div className="titleCard-playIcon" onClick={() => {
																history.push(`/watch/${movie.movieId}`)
																closeModal()
															}}>
																<svg width="24" height="24" viewBox="0 0 24 24"
																	 fill="none" xmlns="http://www.w3.org/2000/svg"
																	 className="titleCard-playSVG ltr-4z3qvp e1svuwfo1"
																	 data-name="Play" aria-hidden="true">
																	<path
																		d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
																		fill="currentColor">
																	</path>
																</svg>
															</div>
															<span className="duration ellipsized">{movie.runtime}</span>
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
																				<div
																					className="meta-thumb-container thumb-up">
																					<svg width="24" height="24"
																						 viewBox="0 0 24 24" fill="none"
																						 xmlns="http://www.w3.org/2000/svg"
																						 className="thumb thumb-up-filled svg-icon svg-icon-thumb-thumb-up-filled ltr-4z3qvp e1svuwfo1"
																						 data-name="ThumbsUpFill"
																						 aria-hidden="true">
																						<path fill-rule="evenodd"
																							  clip-rule="evenodd"
																							  d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z"
																							  fill="currentColor">
																						</path>
																					</svg>
																				</div>
																			</div>
																		</span>
																		</div>
																		<div className="videoMetadata--second-line">
																			<div
																				className="year">{movie.releaseDate.split("-")[2]}</div>
																			<span className="maturity-rating ">
																			<span
																				className="maturity-number">{movie.maturity}</span>
																		</span>
																		</div>
																	</div>
																	<div>
																		<div className="ltr-bjn8wh">
																			<div className="ptrack-content">
																				<button
																					className="color-supplementary hasIcon round ltr-11vo9g5">
																					<div className="ltr-1st24vv">
																						<div
																							className="small ltr-iyulz3">
																							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1" data-name="Plus" aria-hidden="true">
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
											<button
												className="color-supplementary section-expandButton hasIcon round ltr-11vo9g5"
												onClick={() => setCollapsed(collapsed === "collapsed" ? "" : "collapsed")}>
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
												<a> {movie.director}</a>
											</span>
										</div>
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">Cast:</span>
											{movie?.casts.map((cast, index) => (
												<span className="tag-item" key={index}>
													<a> {cast}{index !== movie.casts.length - 1 &&
														<span>,</span>} </a>
												</span>
											))}
										</div>
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">Genres:</span>
											{movie?.genres.map((genre, index) => (
												<span className="tag-item" key={index}>
													<a> {genre.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}{index !== movie.genres.length - 1 &&
														<span>,</span>}</a>
												</span>
											))}
										</div>
										<div className="previewModal--tags">
											<span className="previewModal--tags-label">This Movie is:</span>
											{movie?.keywords.map((keyword, index) => (
												<span className="tag-item" key={index}>
													<a> {keyword}{index !== movie.keywords.length - 1 &&
														<span>,</span>} </a>
												</span>
											))}
										</div>
										<div className="maturity-rating-wrapper">
											<span className="title">Maturity rating:</span>
											<span className="maturity-rating ">
												<a className="maturity-number">{movie.maturity}</a>
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