import config from "../config/config";

// constants
const GET_MOVIES = "movie/GET_MOVIES";

const getMovie = (movies) => ({
    type: GET_MOVIES,
    payload: movies,
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

const initialState = {};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_MOVIES:
            let newState = {};
            action.payload.forEach((movie) => {
                newState[movie.movieId] = movie;
            });
            return newState;
        default:
            return state;
    }
}
