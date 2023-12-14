import config from "../config/config";

// constants
const GET_LIKED_MOVIES = "user/GET_LIKED_MOVIES";
const GET_WATCH_LATER_MOVIES = "user/GET_WATCH_LATER_MOVIES";

const getLikedMovie = (movies) => ({
    type: GET_LIKED_MOVIES,
    payload: movies,
});

const getWatchLaterMovie = (movies) => ({
    type: GET_WATCH_LATER_MOVIES,
    payload: movies,
});

const initialState = { movies: null };

export const getLikedMovies = (username) => async (dispatch) => {
    const response = await fetch(`${config.apiUrl}/api/user/liked/${username}`, {
        method: "GET",
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getLikedMovie(data));
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

export const getWatchLaterMovies = (username) => async (dispatch) => {
    const response = await fetch(`${config.apiUrl}/api/user/watch_later/${username}`, {
        method: "GET",
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getWatchLaterMovie(data));
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

// export const addLikedMovie = (postId, userId) => async (dispatch) => {
//     const response = await fetch(`${config.apiUrl}/api/user/${userId}/favorites/posts/${postId}`,{
//         method:'PUT',
//         headers:{ "Content-Type" : 'application/json' },
//     })
//     if(response.ok) {
//         const user = await response.json();
//         dispatch(addFavorite(user))
//         return user;
//     };
// }
//
// export const deleteLikedMovie = (postId, userId) => async (dispatch) => {
//     const response = await fetch(`${config.apiUrl}/api/user/${userId}/favorites/posts/${postId}`,{
//         method:'DELETE',
//     })
//     if(response.ok) {
//         const user = await response.json();
//         dispatch(deleteFavorite(user))
//         return user;
//     };
// }
//
// export const addWatchLaterMovie = (postId, userId) => async (dispatch) => {
//     const response = await fetch(`${config.apiUrl}/api/users/${userId}/favorites/posts/${postId}`,{
//         method:'PUT',
//         headers:{ "Content-Type" : 'application/json' },
//     })
//     if(response.ok) {
//         const user = await response.json();
//         dispatch(addFavorite(user))
//         return user;
//     };
// }
//
// export const deleteWatchLaterMovie = (postId, userId) => async (dispatch) => {
//     const response = await fetch(`${config.apiUrl}/api/users/${userId}/favorites/posts/${postId}`,{
//         method:'DELETE',
//     })
//     if(response.ok) {
//         const user = await response.json();
//         dispatch(deleteFavorite(user))
//         return user;
//     };
// }

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_LIKED_MOVIES:
            return { ...state, movies: action.payload };
        case GET_WATCH_LATER_MOVIES:
            return { ...state, movies: action.payload };
        default:
            return state;
    }
}
