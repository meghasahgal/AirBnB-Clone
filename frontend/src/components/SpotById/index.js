import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpotById, deleteSpot } from "../../store/spot";
import EditSpotForm from "../EditSpotForm";
import ReviewsBySpotId from "../ReviewsBySpotId";
import CreateReviewForm from "../CreateReviewForm";
import "./SpotById.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import AverageRatingCalc from "../AverageRatingCalc";

const SpotById = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const spot = useSelector((state) => state.spots[spotId]);
	const sessionUser = useSelector((state) => state.session.user);
	const reviews = useSelector((state) => Object.values(state.reviews));
	const review = reviews.filter((review) => review.spotId == spotId); // all reviews for the specific spot
	console.log(review, "review");
	const [showCreateReview, setShowCreateReview] = useState(false);

	//map duplicate reviews - commented out
	// const findDuplicateReviews = review?.filter(
	// 	(rev) => rev?.userId === sessionUser?.id
	// )
	// 	? false
	// 	: true;

	// const show = () => {
	// 	if (findDuplicateReviews == false) {
	// 		return setShowCreateReview(false);
	// 	} else return setShowCreateReview(true);
	// };



	// console.log(findDuplicateReviews, "findDuplicateReviews");
	const star = <FontAwesomeIcon icon={faStar} />;

	useEffect(() => {
		dispatch(getSpotById(spotId));
	}, [spotId]);

	// handleDeleteClick // fixed by taking out the id in the redirect callbackroute
	const handleDeleteClick = (id) => {
		dispatch(deleteSpot(id));
		history.push(`/spots`);
	};

	// //button to edit spot
	const routeChangetoEditForm = () => {
		let path = `/spots/${spotId}/edit`;
		history.push(path);
	};

	// console.log(spotId)

	const routeChangetoCreateReviewForm = () => {
		let path = `/spots/${spotId}/reviews`;
		history.push(path);
	};

	return (
		<>
			{spot && (
				<div className="spots-container-individual-spot">
					<div></div>
					<div></div>
					<div></div>

					<div className="title-text">{spot.description}</div>

					<div className="spot-details-container">
						{/* <div className="spot-id-text-block-intro">Entire Home Hosted By Sherry</div> */}
						<div>
							{spot.city}
							{", "}
							{spot.state}
							{", "}
							{spot.country}
						</div>
						<div>{spot.location}</div>
						<div>
							{/* <FontAwesomeIcon icon={spot.avgRating ? faStar : null} /> */}
							<AverageRatingCalc spot={spot} />
							{"·"}
							{review.length}
							{review.length === 1 ? " review" : " reviews"}
						</div>
						<div className="img-container">
							<div
								className="img-size-id primary-text"
								style={{ backgroundImage: `url('${spot.previewImage}')` }}
							></div>
						</div>
						<div></div>

						{spot.userId === sessionUser?.id && (
							<button
								className="add-review-button"
								onClick={routeChangetoEditForm}
							>
								Edit Spot
							</button>
						)}
						{spot.userId === sessionUser?.id && (
							<button className="add-review-button"onClick={() => handleDeleteClick(spot.id)}>
								Delete Spot
							</button>
						)}
						<br></br>
						<br></br>
						<br></br>
						<div></div>
						<div className="reviews-container">
							<ReviewsBySpotId spot={spot} />
						</div>
						<div></div>
						<br></br>
						<br></br>
						{/* spot owner can't write a review of their own place and a user that already has a review can't write another one*/}
						{sessionUser?.id && spot.userId !== sessionUser?.id && (
							<button
								className="add-review-button"
								onClick={routeChangetoCreateReviewForm}
							>
								Add a Review
							</button>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default SpotById;
