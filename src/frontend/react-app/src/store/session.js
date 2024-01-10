import config from "../config/config";
// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const ADD_PROFILE = "session/ADD_PROFILE";
const UPDATE_PROFILE = "session/UPDATE_PROFILE";
const REMOVE_PROFILE = "session/REMOVE_PROFILE";
const ADD_MOVIE_RATING = "session/ADD_MOVIE_RATING";
const REMOVE_MOVIE_RATING = "session/REMOVE_MOVIE_RATING";
const ADD_LIKE_MOVIE = "session/ADD_LIKE_MOVIE";
const REMOVE_LIKE_MOVIE = "session/REMOVE_LIKE_MOVIE";
const ADD_DISLIKE_MOVIE = "session/ADD_DISLIKE_MOVIE";
const REMOVE_DISLIKE_MOVIE = "session/REMOVE_DISLIKE_MOVIE";
const ADD_WATCH_LATER_MOVIE = "session/ADD_WATCH_LATER_MOVIE";
const REMOVE_WATCH_LATER_MOVIE = "session/REMOVE_WATCH_LATER_MOVIE";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const addProfile = (profile) => ({
	type: ADD_PROFILE,
	payload: { profile }
});

const updateProfile = (updatedProfile) => ({
	type: UPDATE_PROFILE,
	payload: { updatedProfile }
});

const removeProfile = (profileId) => ({
	type: REMOVE_PROFILE,
	payload: { profileId }
});

const addMovieRating = (rating, profile) => ({
	type: ADD_LIKE_MOVIE,
	payload: { rating, profile }
});

const removeMovieRating = (rating, profileId) => ({
	type: REMOVE_LIKE_MOVIE,
	payload: { profileId, rating }
});

const addLikeMovie = (movie, profile) => ({
	type: ADD_LIKE_MOVIE,
	payload: { movie, profile }
});

const removeLikeMovie = (movie, profileId) => ({
	type: REMOVE_LIKE_MOVIE,
	payload: { profileId, movie }
});

const addDislikeMovie = (movie, profile) => ({
	type: ADD_DISLIKE_MOVIE,
	payload: { movie, profile }
});

const removeDislikeMovie = (movie, profileId) => ({
	type: REMOVE_DISLIKE_MOVIE,
	payload: { profileId, movie }
});

const addWatchLaterMovie = (movie, profile) => ({
	type: ADD_WATCH_LATER_MOVIE,
	payload: { movie, profile }
});

const removeWatchLaterMovie = (movie, profileId) => ({
	type: REMOVE_WATCH_LATER_MOVIE,
	payload: { profileId, movie }
});

const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}

	const response = await fetch(`${config.apiUrl}/api/auth/`, {
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}
		dispatch(setUser(data));
	}

};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch(`${config.apiUrl}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		localStorage.setItem("token", data.jwt);
		dispatch(setUser(data.user));
		return null;
	} else if (response.status < 500) {
		const data = await response.text();
		if (data) {
			return data;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch(`${config.apiUrl}/api/auth/logout`, {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		localStorage.removeItem("token");
		dispatch(removeUser());
	}
};

export const signUp = (email, password, firstName, lastName) => async (dispatch) => {
	const response = await fetch(`${config.apiUrl}/api/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			password,
			email,
			firstName,
			lastName
		}),
	});

	if (response.ok) {
		const data = await response.json();
		localStorage.setItem("token", data.jwt);
		dispatch(setUser(data.user));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const verifyEmail = (email) => async (dispatch) => {
	const response = await fetch(`${config.apiUrl}/api/auth/email_verification`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
		}),
	});

	if (response.ok) {
		return null;
	} else if (response.status < 500) {
		const data = await response.text();
		if (data) {
			return data;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const createProfile = (profile) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}

	const response = await fetch(`${config.apiUrl}/api/user/profiles/new`, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${token}`,
			"Content-Type": "application/json" },
		body: JSON.stringify(profile)
	});

	if (response.ok) {
		const newProfile = await response.json();
		await dispatch(addProfile(newProfile));
		return newProfile;
	}
};

export const updateUserProfile = (updatedProfile) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${updatedProfile.profileId}`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedProfile),
	});

	if (response.ok) {
		dispatch(updateProfile(updatedProfile));
	}
};

export const deleteProfile = (user, profileId) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}
	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profileId}`, {
		method: 'DELETE',
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if (response.ok) {
		dispatch(removeProfile(profileId));
	}
};

export const createMovieRating = (profile, rating) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/rating/add`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(rating),
	});

	if (response.ok) {
		dispatch(addMovieRating(rating, profile));
	}
};

export const deleteMovieRating = (rating, profileId) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}
	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profileId}/rating/${rating.ratingId}/delete`, {
		method: 'DELETE',
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if (response.ok) {
		dispatch(removeMovieRating(rating, profileId));
	}
};

export const createLike = (profile, movie) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/like/add`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(movie),
	});

	if (response.ok) {
		dispatch(addLikeMovie(movie, profile));
	}
};

export const deleteLike = (movie, profileId) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}
	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profileId}/like/${movie.movieId}/delete`, {
		method: 'DELETE',
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if (response.ok) {
		dispatch(removeLikeMovie(movie, profileId));
	}
};

export const createDislike = (profile, movie) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/dislike/add`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(movie),
	});

	if (response.ok) {
		dispatch(addDislikeMovie(movie, profile));
	}
};

export const deleteDislike = (movie, profileId) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}
	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profileId}/dislike/${movie.movieId}/delete`, {
		method: 'DELETE',
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if (response.ok) {
		dispatch(removeDislikeMovie(movie, profileId));
	}
};

export const createWatchLaterMovie = (profile, movie) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/watch_later/add`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(movie),
	});

	if (response.ok) {
		dispatch(addWatchLaterMovie(movie, profile));
	}
};

export const deleteWatchLaterMovie = (movie, profileId) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}
	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profileId}/watch_later/${movie.movieId}/delete`, {
		method: 'DELETE',
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if (response.ok) {
		dispatch(removeWatchLaterMovie(movie, profileId));
	}
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { ...state , user: action.payload };
		case REMOVE_USER:
			return { ...state, user: null };
		case ADD_PROFILE:
			const { profile } = action.payload;
			const userProfiles = state.user.profiles
			return { ...state, user: { ...state.user, profiles: [...userProfiles, profile] }
			};
		case UPDATE_PROFILE:
			const { updatedProfile } = action.payload;
			const userUpdate = state.user
			const index = userUpdate.profiles.findIndex(profile => profile.profileId === updatedProfile.profileId);
			userUpdate.profiles[index] = updatedProfile;
			return { ...state, user: { ...state.user, profiles: [...userUpdate.profiles] }
			};
		case REMOVE_PROFILE:
			let { profileId } = action.payload;
			const removedProfile = state.user.profiles.filter(profile => profile.profileId !== profileId);
			return { user: { ...state.user, profiles: removedProfile } };
		case ADD_MOVIE_RATING:
			const { rating: addRating, profile: ratingProfile } = action.payload;
			const userRating = { ...state.user };
			const profileIndexRating = userRating.profiles.findIndex(profile => profile.profileId === ratingProfile.profileId);
			userRating.profiles[profileIndexRating].ratings.push(addRating);
			return { ...state, user: userRating };
		case REMOVE_MOVIE_RATING:
			const { profileId: removeProfileRating, rating: removeRating } = action.payload;
			const updatedRatingProfiles = state.user.profiles.map(profile => {
				if (profile.profileId === removeProfileRating) {
					const updatedRating = profile.ratings.filter(movie => movie.movieId !== removeRating.movieId);
					return { ...profile, likedMovies: updatedRating};
				}
				return profile;
			});
			return { user: { ...state.user, profiles: updatedRatingProfiles } };
		case ADD_LIKE_MOVIE:
			const { movie: likedMovie, profile: likedProfile } = action.payload;
			const userLiked = { ...state.user };
			const profileIndexLiked = userLiked.profiles.findIndex(profile => profile.profileId === likedProfile.profileId);
			userLiked.profiles[profileIndexLiked].likedMovies.push(likedMovie);
			return { ...state, user: userLiked };
		case REMOVE_LIKE_MOVIE:
			let { profileId: removeProfileMovieLike, movie: removeLike } = action.payload;
			const updatedLikeProfiles = state.user.profiles.map(profile => {
				if (profile.profileId === removeProfileMovieLike) {
					const updatedLike = profile.likedMovies.filter(movie => movie.movieId !== removeLike.movieId);
					return { ...profile, likedMovies: updatedLike};
				}
				return profile;
			});
			return { user: { ...state.user, profiles: updatedLikeProfiles } };
		case ADD_DISLIKE_MOVIE:
			const { movie: dislikedMovie, profile: dislikedProfile } = action.payload;
			const userDisliked = { ...state.user };
			const profileIndexDisLiked = userDisliked.profiles.findIndex(profile => profile.profileId === dislikedProfile.profileId);
			userDisliked.profiles[profileIndexDisLiked].dislikedMovies.push(dislikedMovie);
			return { ...state, user: userDisliked };
		case REMOVE_DISLIKE_MOVIE:
			let { profileId: removeProfileMovieDislike, movie: removeDislike } = action.payload;
			const updatedDislikeProfiles = state.user.profiles.map(profile => {
				if (profile.profileId === removeProfileMovieDislike) {
					const updatedDislike = profile.dislikedMovies.filter(movie => movie.movieId !== removeDislike.movieId);
					return { ...profile, dislikedMovies: updatedDislike};
				}
				return profile;
			});
			return { user: { ...state.user, profiles: updatedDislikeProfiles } };
		case ADD_WATCH_LATER_MOVIE:
			const { movie: watchLaterMovie, profile: watchLaterProfile } = action.payload;
			const userWithWatchLater = { ...state.user };
			const profileIndexWatchLater = userWithWatchLater.profiles.findIndex(profile => profile.profileId === watchLaterProfile.profileId);
			userWithWatchLater.profiles[profileIndexWatchLater].watchLaterMovies.push(watchLaterMovie);
			return { ...state, user: userWithWatchLater };
		case REMOVE_WATCH_LATER_MOVIE:
			let { profileId: removeProfileMovieWatchLater, movie: removeWatchLater } = action.payload;
			const updatedProfiles = state.user.profiles.map(profile => {
				if (profile.profileId === removeProfileMovieWatchLater) {
					const updatedWatchLater = profile.watchLaterMovies.filter(movie => movie.movieId !== removeWatchLater.movieId);
					return { ...profile, watchLaterMovies: updatedWatchLater};
				}
				return profile;
			});
			return { user: { ...state.user, profiles: updatedProfiles } };
		default:
			return state;
	}
}
