import { csrfFetch } from "./csrf";

//Actions
const GET_USER_REVIEWS = "user/GET_USER_REVIEWS";

//Action Creators
export const getUserReviewsAction = (reviews) => {
	return {
		type: GET_USER_REVIEWS,
		reviews,
	};
};


//THUNK
export const getUserReviewsThunk = () => async (dispatch) => {
    const response = await 
}
