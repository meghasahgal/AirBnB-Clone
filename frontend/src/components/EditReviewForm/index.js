import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createSpot, editSpot, getSpots, getReviews } from "../../store/spot";

const EditReviewForm = () => {
	const { spotId } = useParams();
	const sessionUser = useSelector((state) => state.session.user);
	const spot = useSelector((state) => state.spots[spotId]);
	// console.log(spot, "spot")
	const dispatch = useDispatch();
	const history = useHistory();

	//set state variables
	const [disabled, setDisabled] = useState(false);
	const [id, setId] = useState(spot.id);
	const [userId, setUserId] = useState(spot.userId);
	const [address, setAddress] = useState(spot.address);

	//get all reviews to see if user id is equal to the session user id
	useEffect(() => {
		dispatch(getReviews());
	}, [dispatch]);

	//redirect user back to spot
	function handleGoBackClick(e) {
		history.push(`/spots/${spot.id}`);
	}

	if (!sessionUser || sessionUser.id !== spot.userId) {
		return (
			<div>
				<div> You cannot edit a review you do not own.</div>
				<button onClick={handleGoBackClick}>Go Back to Spot</button>
			</div>
		);
	}
	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			...spot,
			id,
			userId,
			address,
			city,
			state,
			country,
			lat,
			lng,
			name,
			description,
			price,
			previewImage,
		};

		let editedSpot = await dispatch(editSpot(spot.id, payload));
		console.log(editedSpot, "editedSpot");
		if (editedSpot) {
			history.push(`/spots/${editedSpot.id}`);
			// hideForm();
		}
	};

	const handleCancelClick = (e) => {
		e.preventDefault();
		history.push(`/spots/${spot.id}`);
		// hideForm();
	};
	// NEED TO ADD VALIDATION ERRORS

	return (
		<div>
			<p>Edit Review</p>
			<section className="edit-form-holder">
				<form className="edit-spot-form" onSubmit={handleSubmit}>
					<div>Address</div>
					<input
						type="text"
						placeholder="Update address"
						required
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
					<div>City</div>
					<input
						type="text"
						placeholder="Update city"
						required
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
					<button type="submit">Edit Review</button>
					<button type="button" onClick={handleCancelClick}>
						Cancel
					</button>
				</form>
			</section>
		</div>
	);
};

export default EditReviewForm;
