import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getReviews, deleteReview } from "../../store/review";

const ReviewsBySpotId = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const spot = useSelector((state) => state.spots[spotId]);
	const reviews = useSelector((state) => state.reviews);
	// const review = useSelector(state=>state.reviews[spotId])
	// const allReviewArray = Object.values(review)
	const allReviewsArray = Object.values(reviews);
	const sessionUser = useSelector((state) => state.session.user);

	//dispatch the thunk the get the reviews for the spotId
	useEffect(() => {
		dispatch(getReviews(spotId));
	}, []);

	const routeChangetoDeleteReview = () => {
		let path = `/spots/${spotId}/reviews/${reviews.id}/delete`;
		history.push(path);
	};

	//to prevent the page from re-loading on click and dispatching the delete action creator
	const handleDeleteClick = (id) => {
		dispatch(deleteReview(id));
		history.push(`/spot/${spot.id}`);
	};

	// need to conditionally render by spot id, i.e, retrieve the review by spotId below
	return (
		<div>
			<div className="section-heading">Reviews</div>
			<div className="reviews-container">
				{allReviewsArray.map((review) => (
					<div key={review.id}>
						<div className="review-details">
							<div>{review.review}</div>
							<div>{review.stars}</div>
						</div>
						<button onClick={()=>handleDeleteClick(review.id)}>Delete Review</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ReviewsBySpotId;
