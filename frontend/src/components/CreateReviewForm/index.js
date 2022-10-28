import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getReviews, createReview } from "../../store/review";


const CreateReviewForm = () => {

	const history = useHistory();
	const dispatch = useDispatch();
    const {spotId} = useParams()
    const spot = useSelector(state=>state.spots[spotId])
    const reviews = useSelector((state) =>state.reviews)
    const sessionUser = useSelector((state) => state.session.user);

	//set state variables
	const [disabled, setDisabled] = useState(false);
	const [userId, setUserId] = useState(spot.userId);
	// const [spotId, setSpotId] = useState(spot.spotId)
    const [stars, setStars] = useState()
    const [review, setReview] = useState("")

        const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			reviews,
            stars
		};

		let createdReview = await dispatch(createReview(payload));
		if (createdReview) {
			history.push(`/spots/${createdReview.id}`);
			// hideForm();
		}
	};

	const handleCancelClick = (e) => {
		e.preventDefault();
		history.push(`/spots`)

		// hideForm();
	};

	return (
		<div></div>)

    }

    export default CreateReviewForm;
