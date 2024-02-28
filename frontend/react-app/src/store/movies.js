import config from "../config/config";

// constants
const GET_MOVIES = "movie/GET_MOVIES";
const GET_SIMILAR_MOVIES = "movie/GET_SIMILAR_MOVIES";

const getMovie = (movies) => ({
    type: GET_MOVIES,
    payload: movies,
});

const getSimilarMovies = (similarMovies) => ({
    type: GET_SIMILAR_MOVIES,
    payload: similarMovies,
});

export const getMovies = () => async (dispatch) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

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

    if (!token || !movieName) {
        return;
    }

    const response = await fetch(`http://localhost:5000/api/recommend/similar_movies`, {
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

const initialState = {};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_MOVIES:
            let newState = {};
            action.payload.forEach((movie) => {
                newState[movie.movieId] = movie;
            });
            return newState;
        case GET_SIMILAR_MOVIES:
            return { ...state, similarMovies: action.payload };
        default:
            return state;
    }
}
