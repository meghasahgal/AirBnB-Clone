import {csrfFetch} from './csrf'


//ACTIONS
const LOAD_SPOTS='spots/LOAD_SPOTS'
const GET_SPOTS = 'spots/GET_SPOTS'
const CREATE_SPOTS = 'spots/CREATE_SPOTS'
const UPDATE_SPOTS = 'spots/UPDATE_SPOTS'
const DELETE_SPOTS = 'spots/DELETE_SPOTS'


//ACTION CREATORS
export const loadSpotsActionCreator = (spots) =>{
    return {
        type: LOAD_SPOTS,
        spots
    }
}


export const getSpotsActionCreator = (spots) =>{
    return {
        type: GET_SPOTS,
        spots
    }
}

export const createSpotsActionCreator = (spot) => {
	return {
		type: CREATE_SPOTS,
		spot
	};
};



//HELPER FUNCTIONS
export const getSpots = () => async (dispatch) => {
	const response = await csrfFetch("/api/spots");
    if (response.ok){
	const data = await response.json();
    dispatch(loadSpotsActionCreator(data))
    return data
    }
};

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



//REDUCER
const initialState = {}

const spotReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_SPOTS:
			const allSpots = {};
			action.spots.forEach((spot) => {
				allSpots[spot.id] = spot;
			});
			return {
				...state,
				...allSpots
			};
        case CREATE_SPOTS:
            let newState = {...state}
            newState[action.spot.id] = action.spot
            return newState;


		default:
			return state;
	}
};

export default spotReducer;
