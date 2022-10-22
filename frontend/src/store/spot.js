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
        payload: spots
    }
}

export const createSpotsActionCreator = (spot) => {
	return {
		type: CREATE_SPOTS,
		payload: spot,
	};
};



//HELPER FUNCTIONS
export const getSpots = () => async (dispatch) => {
	const response = await fetch("/api/spots");
    if (response.ok){
	const data = await response.json();
    dispatch(loadSpotsActionCreator(data))//need to finish
    return data
    }
};

// export const getPokemon = () => async (dispatch) => {
// 	const response = await fetch(`/api/pokemon`);

// 	if (response.ok) {
// 		const list = await response.json();
// 		dispatch(load(list));
// 	}
// };


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
				...allSpots,
				...state
			};


		default:
			return state;
	}
};

export default spotReducer;
