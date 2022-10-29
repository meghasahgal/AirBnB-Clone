import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createReview } from "../../store/review";

const CreateReviewForm = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { spotId } = useParams();

    // console.log(spotId, "spotId")
    const userId = useSelector((state) => state.session.user.id)
	const reviews = useSelector((state) => state.reviews);
	const sessionUser = useSelector((state) => state.session.user);
    // console.log(sessionUser, "sessionUser")

	//set state variables
    // const [userId, setUserId] = useState()
    // const [spotId, setSpotId] = useState()

	const [disabled, setDisabled] = useState(false);
	const [stars, setStars] = useState(0);
	const [review, setReview] = useState("");
    const [errors, setErrors] = useState([])

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
            userId,
            spotId,
			review,
			stars,
		};


		let createdReview = await dispatch(createReview(spotId, payload));
		if (createdReview) {
			//need to change the route here SOON!
			history.push(`/spots/${spotId}/reviews/${createdReview.id}`);
			// hideForm();
		}
	};

	const handleCancelClick = (e) => {
		e.preventDefault();
		history.push(`/spots/${spotId}`);

		// hideForm();
	};

	return (
		<div>
			<div>
				<section className="new-form-holder">
					<form className="create-review-form" onSubmit={handleSubmit}>
						<div>Write Your Review</div>
						<input
							type="textarea"
							placeholder="Enter review"
							required
							value={review}
							onChange={(e) => setReview(e.target.value)}
						/>
						<div>Stars</div>
						<input
							type="number"
							placeholder="Enter stars"
							required
							value={stars}
							onChange={(e) => setStars(e.target.value)}
						/>


						<br></br>
						<br></br>
						<button type="submit">Create Review</button>
						<button type="button" onClick={handleCancelClick}>
							Cancel
						</button>
					</form>
				</section>
			</div>
		</div>
	);
};

export default CreateReviewForm;
