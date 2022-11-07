import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getReviews, deleteReview } from "../../store/review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import "./ReviewsBySpotId.css"

const ReviewsBySpotId = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const spot = useSelector((state) => state.spots[spotId]);
	const reviews = useSelector((state) => state.reviews);
	//filter reviews for specific spot
	const allReviewsArray = Object.values(reviews).filter((review)=> spotId == review.spotId);
	const sessionUser = useSelector((state) => state.session.user);
	//dispatch the thunk the get the reviews for the spotId
	useEffect(() => {
		dispatch(getReviews(spotId));
	}, []);
	//to prevent the page from re-loading on click and dispatching the delete action creator
	const handleDeleteClick = (id) => {
		dispatch(deleteReview(id));
		history.push(`/spots/${spot.id}`);
	};

	return (
		<div>
			<div className="primary-text">Reviews</div>
			<hr></hr>
			<div className="reviews-container">
				{allReviewsArray.map((review) => (
					<div className="review-id" key={review.id}>
						<div className="review-details">
							<div className="review-font">{review?.User?.firstName} {" "} {review?.User?.lastName}</div>
							<div>{review.review}</div>
							<div>
								<FontAwesomeIcon icon={review.stars ? faStar : null} />{" "}
								{review.stars}
							</div>
						</div>
						{review.userId === sessionUser?.id && (
							<button className="delete-spot-button" onClick={() => handleDeleteClick(review.id)}>
								Delete Review
							</button>
						)}
						<hr></hr>

					</div>

				))}
			</div>
		</div>
	);
};

export default ReviewsBySpotId;
