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


const SpotById = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const spot = useSelector((state) => state.spots[spotId]);
	const sessionUser = useSelector((state) => state.session.user);
    const reviews = useSelector((state) => Object.values(state.reviews));


    const star = <FontAwesomeIcon icon={faStar} />;

	useEffect(() => {
		dispatch(getSpotById(spotId));
	}, [spotId]);

    // handleDeleteClick
    	const handleDeleteClick = (id) => {
				dispatch(deleteSpot(id));
				history.push(`/spots/${spot.id}`);
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

    //map duplicate reviews
    const findDuplicateReviews = reviews.filter(review => review.userId === sessionUser.id)

	return (
        <>
        {spot &&(
		<div className="spots-container">
			<div></div>
			<div></div>
			<div></div>
			<div

				className="img-size primary-text"
				style={{ backgroundImage: `url('${spot.previewImage}')` }}
			></div>
			<div>
				{spot.city}
				{", "}
				{spot.state}
				{", "}
				{spot.country}
			</div>
			<div>{spot.location}</div>
			<div>{spot.description}</div>
			<div>
				{spot.avgRating}

				<FontAwesomeIcon icon={spot.avgRating ? faStar : null} />
			</div>
			<div>
				{reviews.length}
				{reviews.length === 1 ? " review" : " reviews"}
			</div>
			{spot.userId === sessionUser?.id && (
				<button onClick={routeChangetoEditForm}>Edit Spot</button>
			)}
			{spot.userId === sessionUser?.id && (
				<button onClick={() => handleDeleteClick(spot.id)}>Delete Spot</button>
			)}
			<br></br>
			<br></br>
			<br></br>
			<div></div>
			<ReviewsBySpotId />

			<div></div>
			<br></br>
			<br></br>
            {/* spot owner can't write a review of their own place */}
			{spot.userId !== sessionUser?.id && (
				<button onClick={routeChangetoCreateReviewForm}>Add a Review</button>
			 )}
		</div>
        )}
       </>
	);

	{
		/* <button onClick={routeChangetoEditForm}>Edit Spot</button>
				<button onClick={routeChangetoDelete}>Delete Spot</button> */
	}

	{
		/* <div>
					<EditSpotForm />
				</div> */
	}
};

export default SpotById;
