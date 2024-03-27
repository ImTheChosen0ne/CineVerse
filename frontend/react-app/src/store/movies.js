import config from "../config/config";

// constants
const GET_MOVIES = "movie/GET_MOVIES";
const GET_SIMILAR_MOVIES = "movie/GET_SIMILAR_MOVIES";
const GET_SIMILAR_MODAL_MOVIES = "movie/GET_SIMILAR_MODAL_MOVIES";

const getMovie = (movies) => ({
    type: GET_MOVIES,
    payload: movies,
});

const getSimilarMovies = (similarMovies) => ({
    type: GET_SIMILAR_MOVIES,
    payload: similarMovies,
});

const getSimilarModalMovies = (similarMovies) => ({
    type: GET_SIMILAR_MODAL_MOVIES,
    payload: similarMovies,
});

export const getMovies = () => async (dispatch) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }
    // const response = await fetch(`/api/movies/` , {
    const response = await fetch(`${config.apiUrl}/api/movies/` , {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getMovie(data));
    }
};

export const getSimilarMoviesAction = (movieName, movies) => async (dispatch) => {
    const token = localStorage.getItem("token");

    if (!token || !movieName || !movies) {
        return;
    }
    // const response = await fetch(`/api/recommend/similar_movies`, {
    const response = await fetch(`${config.recUrl}/api/recommend/similar_movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            movie_name: movieName,
            movies
        }),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getSimilarMovies(data.similar_movies));
    }
};

export const getSimilarModalMoviesAction = (movieName, movies) => async (dispatch) => {
    const token = localStorage.getItem("token");

    if (!token || !movieName || !movies) {
        return;
    }
    // const response = await fetch(`/api/recommend/similar_movies`, {
    const response = await fetch(`${config.recUrl}/api/recommend/similar_movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            movie_name: movieName,
            movies
        }),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getSimilarModalMovies(data.similar_movies));
    }
};

const initialState = {
    movies: {},
    similarMovies: {},
    modalMovies: {}
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_MOVIES:
            const getMovies = { ...state.movies };
            action.payload.forEach((movie) => {
                getMovies[movie.movieid] = movie;
            });
            return { ...state, movies: getMovies };
        case GET_SIMILAR_MOVIES:
            return { ...state, similarMovies: action.payload };
        case GET_SIMILAR_MODAL_MOVIES:
            return { ...state, modalMovies: action.payload };
        default:
            return state;
    }
}
