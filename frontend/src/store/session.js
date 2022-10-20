import { csrfFetch } from "./csrf";

const SET_SESSION = "session/SET_SESSION";
const REMOVE_SESSION = "session/REMOVE_SESSION";

//action creators
export const loadUser = (user) => {
	return {
		type: SET_SESSION,
		payload: user,
	};
};

export const removeUser = () => {
	return {
		type: REMOVE_SESSION,
		payload: null,
	};
};

//login thunk
//csrfFetch = to make fetch requests with any HTTP verb other than GET, you need to set a XSRF-TOKEN header on the request and the value of the header should be set to the value of the XSRF-TOKEN cookie. To do this, you are going to wrap the fetch function on the window that will be used in place of the default fetch function.

export const logInThunk = (user) => async (dispatch) => {
	const { credential, password } = user;
	const response = await csrfFetch("api/session", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ credential, password }),
	});

	if (response.ok) {
		const newUser = await response.json();
		dispatch(loadUser(newUser));
		return newUser;
	}
};

//restore session thunk
export const restoreSessionThunk = () => async (dispatch) => {
	const response = await csrfFetch("api/session");
	if (response.ok) {
		const data = await response.json();
		dispatch(loadUser(data.user));
		return data;
	}
};
//session reducer that will hold the current session user's information, start off with nothing in state
const initialState = { user: null };
const sessionReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_SESSION: {
			return { ...state, ...action.payload };
		}
		case REMOVE_SESSION: {
			return null;
		}
		default:
			return state;
	}
};

export default sessionReducer;
