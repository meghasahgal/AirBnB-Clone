import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpotById } from "../../store/spot";
import EditSpotForm from "../EditSpotForm";
import ReviewsBySpotId from "../ReviewsBySpotId";
import CreateReviewForm from "../CreateReviewForm";
import "./SpotById.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SpotById = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const spot = useSelector((state) => state.spots[spotId]);
	const sessionUser = useSelector((state) => state.session.user);
	const [showEditSpotForm, setShowEditSpotForm] = useState(false);

	useEffect(() => {
		dispatch(getSpotById(spotId));
	}, [spotId]);

	// //button to edit spot
	const routeChangetoEditForm = () => {
		let path = `/spots/${spotId}/edit`;
		history.push(path);
	};

	//  console.log(history, "history");
	// // //button to delete spot
	const routeChangetoDelete = () => {
		let path = `/spots/${spotId}/delete`;
		history.push(path);
	};

    //   const routeChangetoDeleteReviewForm = () => {
	// 			let path = `/spot/${spotId}/reviews/delete`;
	// 			history.push(path);
	// 		};


    const routeChangetoCreateReviewForm = () => {
			let path = `/spots/${spotId}/reviews`;
			history.push(path);
		};

	return (
		<div className="spots-container">
			<div></div>
			<div></div>
			<div></div>
			<div
				className="img-size primary-text"
				style={{ backgroundImage: `url('${spot.previewImage}')` }}
			></div>
			<div>{spot.city}</div>
			<div>{spot.location}</div>
			<div>{spot.description}</div>
			<div>
				{spot.avgRating}
				<i class="fa-solid fa-star"></i>
				{/* <FontAwesomeIcon icon={spot.avgRating? "fa-solid fa-star":null} /> */}
			</div>
			<button onClick={routeChangetoEditForm}>Edit Spot</button>
			<button onClick={routeChangetoDelete}>Delete Spot</button>
			<br></br>
			<br></br>
			<br></br>
			<div></div>
			<ReviewsBySpotId />

            <div></div>
            <br></br>
            <br></br>
			<button onClick={routeChangetoCreateReviewForm}>Add a Review</button>
			{/* <button onClick={routeChangetoDeleteReviewForm}>Delete a Review</button> */}
		</div>
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
