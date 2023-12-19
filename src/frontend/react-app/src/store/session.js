import config from "../config/config";
// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return;
	}

	const response = await fetch(`${config.apiUrl}/api/auth/`, {
		headers: {
			// "Content-Type": "application/json",
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
	console.log("response", response)
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

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { user: action.payload };
		case REMOVE_USER:
			return { user: null };
		default:
			return state;
	}
}
