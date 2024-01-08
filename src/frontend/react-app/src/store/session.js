import config from "../config/config";
// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const ADD_PROFILE = "session/ADD_PROFILE";
const UPDATE_PROFILE = "session/UPDATE_PROFILE";
const REMOVE_PROFILE = "session/REMOVE_PROFILE";
const ADD_LIKE_MOVIE = "session/ADD_LIKE_MOVIE";
const REMOVE_LIKE_MOVIE = "session/REMOVE_LIKE_MOVIE";
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

const addLikeMovie = (movie, profile) => ({
	type: ADD_LIKE_MOVIE,
	payload: { movie, profile }
});

const removeLikeMovie = (profileId, movie) => ({
	type: REMOVE_LIKE_MOVIE,
	payload: { profileId, movie }
});

const addWatchLaterMovie = (movie, profile) => ({
	type: ADD_WATCH_LATER_MOVIE,
	payload: { movie, profile }
});

const removeWatchLaterMovie = (profileId, movie) => ({
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
	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profileId}/like/delete`, {
		method: 'DELETE',
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if (response.ok) {
		dispatch(removeLikeMovie(movie, profileId));
	}
};

export const createWatchLaterMovie = (profile, movie) => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}

	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profile.profileId}/watchlater/add`, {
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
	const response = await fetch(`${config.apiUrl}/api/user/profiles/${profileId}/watchlater/delete`, {
		method: 'DELETE',
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if (response.ok) {
		dispatch(removeWatchLaterMovie(movie));
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
		case ADD_LIKE_MOVIE:
			const { movie: likedMovie, profile: likedProfile } = action.payload;
			const userLiked = { ...state.user };
			const profileIndexLiked = userLiked.profiles.findIndex(profile => profile.profileId === likedProfile.profileId);
			userLiked.profiles[profileIndexLiked].watchLaterMovies.push(likedMovie);
			return { ...state, user: userLiked };
		case REMOVE_LIKE_MOVIE:
			let { profileId: removeProfileMovieLike, movie: removeLike } = action.payload;
			const removedLikeMovieProfile = state.user.profiles.filter(profile => profile.profileId !== removeProfileMovieLike);
			const removeLikeMovie = removedLikeMovieProfile.filter(movie => movie.movieId !== removeLike.movieId)
			return { user: { ...state.user, profiles: state.user.profiles, watchLaterMovies: removeLikeMovie} };
		case ADD_WATCH_LATER_MOVIE:
			const { movie: watchLaterMovie, profile: watchLaterProfile } = action.payload;
			const userWithWatchLater = { ...state.user };
			const profileIndexWatchLater = userWithWatchLater.profiles.findIndex(profile => profile.profileId === watchLaterProfile.profileId);
			userWithWatchLater.profiles[profileIndexWatchLater].watchLaterMovies.push(watchLaterMovie);
			return { ...state, user: userWithWatchLater };
		case REMOVE_WATCH_LATER_MOVIE:
			let { profileId: removeProfileMovieWatchLater, movie: removeWatchLater } = action.payload;
			const removedWatchLaterProfile = state.user.profiles.filter(profile => profile.profileId === removeProfileMovieWatchLater);
			const removeWatchLaterMovie = removedWatchLaterProfile.filter(movie => movie.movieId !== removeWatchLater.movieId)
			return { user: { ...state.user, profiles: state.user.profiles, watchLaterMovies: removeWatchLaterMovie} };
		default:
			return state;
	}
}
