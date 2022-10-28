import { csrfFetch } from "./csrf";

//ACTIONS
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const CREATE_SPOTS = "spots/CREATE_SPOTS";
const UPDATE_SPOTS = "spots/UPDATE_SPOTS";
const DELETE_SPOTS = "spots/DELETE_SPOTS";

//ACTION CREATORS
// GET
export const loadSpotsActionCreator = (spots) => {
	return {
		type: LOAD_SPOTS,
		spots,
	};
};


//POST
export const createSpotsActionCreator = (spot) => {
	return {
		type: CREATE_SPOTS,
		spot,
	};
};

// EDIT
export const updateSpotsActionCreator = (spotId, spot) => {
	return{
		type: UPDATE_SPOTS,
		spotId, spot
	}
}

// DELETE
export const deleteSpotsActionCreator = (spotId) => {
	return {
		type: DELETE_SPOTS,
		spotId,
	};
};

//HELPER FUNCTIONS/THUNKS
// GET all spots
export const getSpots = () => async (dispatch) => {
	const response = await csrfFetch("/api/spots");
	if (response.ok) {
		const data = await response.json();
		dispatch(loadSpotsActionCreator(data));
		return data;
	}
};

// GET spot by id
export const getSpotById = (spotId) => async (dispatch)=>{
	const response = await csrfFetch(`/api/spots/${spotId}`)

	if (response.ok){
		const data = await response.json()
		dispatch(loadSpotsActionCreator(data))
		return data;
	}

}

// CREATE spot
export const createSpot = (spot) => async (dispatch) => {
	const response = await csrfFetch("/api/spots", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(spot),
	});

	if (response.ok) {
		const newSpot = await response.json();
		console.log(newSpot);
		dispatch(createSpotsActionCreator(newSpot));
		return newSpot;
	}
};

// EDIT spot
export const editSpot = (spotId, spot) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${spotId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(spot),
	});

	if (response.ok) {
		const editedSpot = await response.json();
		console.log(editedSpot);
		dispatch(updateSpotsActionCreator(editedSpot));
		return editedSpot;
	}
};

//DELETE SPOT
export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if(response.ok){
	dispatch(deleteSpotsActionCreator(spotId))
  }}



//REDUCER
const initialState = {};

const spotReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_SPOTS:
			const allSpots = {};
			action.spots.forEach((spot) => {
				allSpots[spot.id] = spot;
			});
			return {
				...state,
				...allSpots,
			};

		case CREATE_SPOTS:
			let newState = { ...state };
			newState[action.spot.id] = action.spot;
			return newState;

		case UPDATE_SPOTS:
			let newState1 ={...state};
			newState1[action.spotId] = action.spot;
			return newState1;

		case DELETE_SPOTS:
			let newState2 = { ...state };
			delete newState2[action.spotId];
			return newState2;

		default:
			return state;
	}
};

export default spotReducer;
