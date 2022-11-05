import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createReview } from "../../store/review";
import "./CreateReviewForm.css"

const CreateReviewForm = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { spotId } = useParams();

	// console.log(spotId, "spotId")
	const userId = useSelector((state) => state.session.user.id);
	const reviews = useSelector((state) => state.reviews);
	const sessionUser = useSelector((state) => state.session.user);
	// console.log(sessionUser, "sessionUser")

	//set state variables
	// const [userId, setUserId] = useState()
	// const [spotId, setSpotId] = useState()

	const [disabled, setDisabled] = useState(false);
	const [stars, setStars] = useState(0);
	const [review, setReview] = useState("");
	const [validationErrors, setValidationErrors] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			userId,
			spotId,
			review,
			stars,
		};

		let createdReview = await dispatch(createReview(spotId, payload));
		// if (createdReview) {
		// 	go back to route
		history.push(`/spots/${spotId}`);
			// hideForm();
		// }
	};

	// error handler
	useEffect(() => {
		const newErrors = [];
		if (!review) {
			newErrors.push("Review is required");
		}
		if (!stars) {
			newErrors.push("Stars field is required");
		}
		if(stars < 1.0 || stars > 5.0)
		{
			newErrors.push("Stars field needs to be a decimal number between 1.0 and 5.0");
		}
		setValidationErrors(newErrors);
	}, [review, stars]);

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
						<h1>Write Your Review</h1>
						<div>Review</div>

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

						<button
							className="small-btn"
							type="button"
							onClick={handleCancelClick}
						>
							Cancel
						</button>
						<button
							className="small-btn"
							type="submit"
							disabled={validationErrors.length > 0}
						>
							Submit
						</button>
						<ul className="errors">
							{validationErrors.length > 0 &&
								validationErrors.map((error) => <li key={error}>{error}</li>)}
						</ul>
					</form>
				</section>
			</div>
		</div>
	);
};

export default CreateReviewForm;
