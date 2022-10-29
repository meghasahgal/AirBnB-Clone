import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getSpotById, deleteReview, getReviews } from "../../store/review";


const DeleteReview = () => {
const history = useHistory();
	const dispatch = useDispatch();
    const {spotId} = useParams()
    const {reviewId} =useParams()
    const spot = useSelector(state=>state.spots[spotId])
    const reviews = useSelector((state) =>state.reviews)
    const review = useSelector(state=>state.reviews[reviewId])
    // const allReviewArray = Object.values(review)
    const allReviewsArray = Object.values(reviews)
    const sessionUser = useSelector((state) => state.session.user);

    //dispatch the thunk the get the reviews for the spotId
    useEffect(() => {
        dispatch(getReviews(spotId));
    },[])

	//re-route to spot if review doesn't belong to the current user
	const handleGoBackToReviewsClick = (e) => {
		history.push(`/spot/${spot.id}`);
	};

	//checking if the review belongs to the current session user
	if (!sessionUser || sessionUser.id !== review.userId) {
		return (
			<div>
				<div> You cannot delete a review that you do not own.</div>
				<button onClick={handleGoBackToReviewsClick}>Go Back to Review</button>
			</div>
		);
	}

	//to prevent the page from re-loading on click and dispatching the delete action creator
	const handleDeleteClick = (e) => {
		e.preventDefault();
		dispatch(deleteReview(review.id));
		history.push(`/spot/${spot.id}`);
	};

	const handleCancelClick = (e) => {
		history.push(`/spot/${spot.id}`);
	};

	return (
		<div>
			<h1>Are you sure you want to delete this review?</h1>
			<br></br>
			<br></br>
			<br></br>
			<button onClick={handleDeleteClick}>Delete</button>
			<button onClick={handleCancelClick}>Cancel</button>
		</div>
	);
};

export default DeleteReview;
