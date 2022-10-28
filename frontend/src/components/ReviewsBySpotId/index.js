import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getReviews } from "../../store/review";

const ReviewsBySpotId = () => {
	const history = useHistory();
	const dispatch = useDispatch();
    const {spotId} = useParams()
    const spot = useSelector(state=>state.spots[spotId])
    const reviews = useSelector((state) =>state.reviews)
    // const review = useSelector(state=>state.reviews[spotId])
    // const allReviewArray = Object.values(review)
    const allReviewsArray = Object.values(reviews)
    const sessionUser = useSelector((state) => state.session.user);

    //dispatch the thunk the get the reviews for the spotId
    useEffect(() => {
        dispatch(getReviews(spotId));
    },[])

// need to conditionally render by spot id, i.e, retrieve the review by spotId below
	return (
		<div>
			<div className="section-heading">Reviews</div>
            <div className="reviews-container">
				{allReviewsArray.map((review) => (
					<div key={review?.id}>
						<div className="review-details">

							{/* <div>{review.spotId}</div> */}
							<div>{review.review}</div>
							<div>{review.stars}</div>
                            </div>
                            </div>
                            ))}

		</div>
        </div>
	);
};

export default ReviewsBySpotId;
