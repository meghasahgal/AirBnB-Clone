import { csrfFetch } from "./csrf";

//Actions
const GET_REVIEWS = "reviews/GET_REVIEWS";
const CREATE_REVIEW = "reviews/CREATE_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

//ACTION CREATORS
// GET
export const getReviewsActionCreator = (reviews) => {
	return {
		type: GET_REVIEWS,
		reviews,
	};
};
//POST
export const createReviewActionCreator = (review) =>{
    return {
        type: CREATE_REVIEW,
        review
    }
}

// DELETE
export const deleteReviewActionCreator = (reviewId) => {
	return {
		type: DELETE_REVIEW,
		reviewId,
	};
};

//THUNKS
// GET all reviews by spotId
export const getReviews = (spotId) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
	if (response.ok) {
		const data = await response.json();
		dispatch(getReviewsActionCreator(data));
		return data;
	}
};

// CREATE A REVIEW based on spotId
export const createReview = (spotId, review) => async (dispatch) =>{
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(review),
		});

        if(response.ok){
            const data = await response.json();
            dispatch(createReviewActionCreator(data))
            return data;
        }
}

// DELETE a REVIEW
export const deleteReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`,{
         method: "DELETE",
        });
        if(response.ok){
            dispatch(deleteReviewActionCreator(reviewId))
        }}


//REDUCER
const initialState = {};
const reviewReducer = (state=initialState, action) =>{
    let newState = {...state}
    switch(action.type){
    case GET_REVIEWS:
			const allReviews = {};
			action.reviews.forEach((review) => {
				allReviews[review.id] = review;
			});
			return {
				...state,
				...allReviews,
			};
    case CREATE_REVIEW:
        newState[action.review.id] = action.review
        return newState
    case DELETE_REVIEW:
        delete newState[action.reviewId]
        return newState;
    default:
    return state;
}}

export default reviewReducer;
