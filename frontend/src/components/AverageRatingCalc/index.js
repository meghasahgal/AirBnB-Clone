import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getReviews } from "../../store/review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons";

// map through all reviews based on spot id then render in Spots
const AverageRatingCalc = ({spot}) => {
	const dispatch = useDispatch();
	// const { spotId } = useParams();
	// const spot = useSelector((state) => state.spots[spotId]);

	// console.log(spot, "spot");
    const spotId = spot.id
	const reviews = useSelector((state) => state.reviews);
	//dispatch the thunk the get the reviews for the spotId
	useEffect(() => {
		dispatch(getReviews(spotId));
	}, []);

	//get all reviews where spot id = spot id of the review(s)
	const allReviewsArray = Object.values(reviews).filter(
		(review) => spotId == review.spotId
	);
	console.log(allReviewsArray, "allReviewsArray"); //returns an array of objs
	const sessionUser = useSelector((state) => state.session.user);

	const filteredReviewsForStars = allReviewsArray.map((review) => review.stars);
	console.log(filteredReviewsForStars, "filteredReviewsForStars"); // returns an array of stars numbers
	//average calculation

	const averageStars = (filteredReviewsForStars, spotId) => {
		let average;
		let total = 0;
		for (let i = 0; i < filteredReviewsForStars.length; i++) {
			let stars = filteredReviewsForStars[i];
			total += stars;
		}
		average = total / filteredReviewsForStars.length;
        console.log("average", average)
		return average;
	};


	return (
		<div>
			{" "}
			<FontAwesomeIcon
				icon={filteredReviewsForStars.length ? faStar : null}
			/>{" "}
			{averageStars(filteredReviewsForStars, spotId)
				? Number(averageStars(filteredReviewsForStars, spotId)).toFixed(1)
				: "New"}
		</div>
	);
};
export default AverageRatingCalc;
