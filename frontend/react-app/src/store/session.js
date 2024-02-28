import config from "../config/config";
// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const UPDATE_USER = "session/UPDATE_USER";

const ADD_PROFILE = "session/ADD_PROFILE";
const UPDATE_PROFILE = "session/UPDATE_PROFILE";
const REMOVE_PROFILE = "session/REMOVE_PROFILE";

const ADD_MOVIE_RATING = "session/ADD_MOVIE_RATING";
const UPDATE_MOVIE_RATING = "session/UPDATE_MOVIE_RATING";
const REMOVE_MOVIE_RATING = "session/REMOVE_MOVIE_RATING";

const ADD_WATCH_LATER_MOVIE = "session/ADD_WATCH_LATER_MOVIE";
const REMOVE_WATCH_LATER_MOVIE = "session/REMOVE_WATCH_LATER_MOVIE";

const ADD_VIEWED_MOVIE = "session/ADD_VIEWED_MOVIE";
const UPDATE_VIEWED_MOVIE = "session/UPDATE_VIEWED_MOVIE";

const GET_USER_MOVIES = "movie/GET_USER_MOVIES";


const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const updateUser = (user) => ({
	type: UPDATE_USER,
	payload: { user }
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
	type: ADD_MOVIE_RATING,
	payload: { rating, profile }
});

const updateRating = (updatedRating, profile) => ({
	type: UPDATE_MOVIE_RATING,
	payload: { updatedRating, profile }
});

const removeMovieRating = (rating, profileId) => ({
	type: REMOVE_MOVIE_RATING,
	payload: { profileId, rating }
});

const addWatchLaterMovie = (movie, profile) => ({
	type: ADD_WATCH_LATER_MOVIE,
	payload: { movie, profile }
});

const removeWatchLaterMovie = (movie, profileId) => ({
	type: REMOVE_WATCH_LATER_MOVIE,
	payload: { profileId, movie }
});

const addViewed = (viewed, profile) => ({
	type: ADD_VIEWED_MOVIE,
	payload: { viewed, profile }
});

const updateViewed = (updatedViewed, profile) => ({
	type: UPDATE_VIEWED_MOVIE,
	payload: { updatedViewed, profile }
});

const getUserMovies = (movies, profile) => ({
	type: GET_USER_MOVIES,
	payload: { movies, profile }
});

const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

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
		return null;
	}
};

export const signUp = (email, password, firstName, lastName, profileName, plan) => async (dispatch) => {
	const response = await fetch(`${config.apiUrl}/api/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			password,
			email,
			firstName,
			lastName,
			profileName,
			plan
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

export const updatedUsers = (updatedUser) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	const response = await fetch(`${config.apiUrl}/api/user/update`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedUser),
	});

	if (response.ok) {
		const updatedUser = await response.json();
		dispatch(updateUser(updatedUser));
		return updatedUser;
	}
};


export const createProfile = (profile) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	const response = await fetch(`${config.apiUrl}/api/user/profiles/new`, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${token}`,
			"Content-Type": "application/json" },
		body: JSON.stringify(profile)
	});

	if (response.ok) {
		const newUserProfile = await response.json();
		await dispatch(addProfile(newUserProfile));
		return newUserProfile;
	}
};

export const updateUserProfile = (updatedProfile) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${updatedProfile.profileId}`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedProfile),
	});

	if (response.ok) {
		const updateUserProfile = await response.json();
		dispatch(updateProfile(updateUserProfile));
		return updateUserProfile;
	}
};

export const deleteProfile = (user, profileId) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

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
	if (!token) return;

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/rating/add`, {
		method: 'POST',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(rating),
	});

	if (response.ok) {
		const newRating = await response.json();
		dispatch(addMovieRating(newRating, profile));
		return newRating;
	}
};

export const updateMovieRating = (profile, updatedMovieRating) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/rating/${updatedMovieRating.ratingId}/update`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedMovieRating),
	});

	if (response.ok) {
		const updatedRatingMovie = await response.json();
		dispatch(updateRating(updatedRatingMovie, profile));
		return updatedRatingMovie;
	}
};

export const deleteMovieRating = (rating, profileId) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

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

export const createWatchLaterMovie = (profile, movie) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/watch_later/add`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(movie),
	});

	if (response.ok) {
		const watchLaterMovie = await response.json();
		dispatch(addWatchLaterMovie(watchLaterMovie, profile));
		return watchLaterMovie;
	}
};

export const deleteWatchLaterMovie = (movie, profileId) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

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

export const createViewedMovie = (profile, viewed) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/viewed/add`, {
		method: 'POST',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(viewed),
	});

	if (response.ok) {
		const newView = await response.json();
		dispatch(addViewed(newView, profile));
		return newView;
	}
};

export const updateViewedMovie = (profile, updatedView) => async (dispatch) => {
	const token = localStorage.getItem("token");
	if (!token) return;

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/viewed/${updatedView.viewedId}/update`, {
		method: 'PUT',
		headers: {
			"Authorization": `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedView),
	});

	if (response.ok) {
		const updateView = await response.json();
		dispatch(updateViewed(updateView, profile));
		return updateView;
	}
};

export const recommendedMovies = (profile, movies) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token || !profile) {
		return;
	}

	const response = await fetch(`http://localhost:5000/api/recommend/user_recommendations`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		body: JSON.stringify({
			profile,
			movies
		}),
	});

	if (response.ok) {
		const data = await response.json();
		console.log(data.recommendations)
		dispatch(getUserMovies(data.recommendations, profile));
	}
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { ...state , user: action.payload };
		case REMOVE_USER:
			return { ...state, user: null };
		case UPDATE_USER:
			const { user } = action.payload;
			return { ...state, user: user};
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
			return { ...state, user: { ...state.user, profiles: [...userUpdate.profiles] }};
		case REMOVE_PROFILE:
			let { profileId } = action.payload;
			const removedProfile = state.user.profiles.filter(profile => profile.profileId !== profileId);
			return { user: { ...state.user, profiles: removedProfile } };
		case ADD_MOVIE_RATING:
			const { rating: addRating, profile: ratingProfile } = action.payload;
			const userRating = { ...state.user };
			const profileIndexRating = userRating.profiles.findIndex(profile => profile.profileId === ratingProfile.profileId);
			userRating.profiles[profileIndexRating].profileRatings.push(addRating);
			return { ...state, user: userRating };
		case UPDATE_MOVIE_RATING:
			const { updatedRating, profile: updateRatingProfile } = action.payload;
			const updatedRatingProfiles = state.user.profiles.map(profile => {
				if (profile.profileId === updateRatingProfile.profileId) {
					const updatedRatings = profile.profileRatings.map(rating => {
						return rating.ratingId === updatedRating.ratingId ? updatedRating : rating;
					});
					return { ...profile, profileRatings: updatedRatings };
				}
				return profile;
			});
			return { user: { ...state.user, profiles: updatedRatingProfiles } };
		case REMOVE_MOVIE_RATING:
			const { profileId: removeProfileRating, rating: removeRating } = action.payload;
			const removeRatingProfiles = state.user.profiles.map(profile => {
				if (profile.profileId === removeProfileRating) {
					const updatedRating = profile.profileRatings.filter(rating => rating.ratingId !== removeRating.ratingId);
					return { ...profile, profileRatings: updatedRating};
				}
				return profile;
			});
			return { user: { ...state.user, profiles: removeRatingProfiles } };
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
		case ADD_VIEWED_MOVIE:
			const { viewed: addView, profile: viewedProfile } = action.payload;
			const userView = { ...state.user };
			const profileIndexView = userView.profiles.findIndex(profile => profile.profileId === viewedProfile.profileId);
			userView.profiles[profileIndexView].viewedMovies.push(addView);
			return { ...state, user: userView };
		case UPDATE_VIEWED_MOVIE:
			const { updatedViewed, profile: updateViewedProfile } = action.payload;
			const updatedViewProfiles = state.user.profiles.map(profile => {
				if (profile.profileId === updateViewedProfile.profileId) {
					const updatedViews = profile.viewedMovies.map(viewedMovie => {
						return viewedMovie.viewedId === updatedViewed.viewedId ? updatedViewed : viewedMovie;
					});
					return { ...profile, viewedMovies: updatedViews };
				}
				return profile;
			});
			return { user: { ...state.user, profiles: updatedViewProfiles } };
		case GET_USER_MOVIES:
			const { movies: recommendedMovies, profile: recommendProfile } = action.payload;

			// Assuming state.user contains the user's data including profiles
			const updateProfiles = state.user.profiles.map(profile => {
				if (profile === recommendProfile) {
					// If it's the target profile, update the recommendedMovies
					return { ...profile, recommendedMovies };
				}
				// If it's not the target profile, keep it unchanged
				return profile;
			});

			return {
				...state,
				user: {
					...state.user,
					profiles: updateProfiles,
				}
			}
		default:
			return state;
	}
}
