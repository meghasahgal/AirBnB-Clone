
// map through all reviews based on spot id then render in Spots
const AverageRatingCalc = () => {
	const allSpotsArray = useSelector((state) => Object.values(state.spots));
	const allReviewsArray = useSelector((state) => Object.values(state.reviews));
	// const allReviewsArray = Object.values(reviews).map(
	// 	(review) => spotId == review.spotId
	// 	);
	const filteredReviewsForStars = allReviewsArray.map(review => review.stars)

	//average calculation

	const averageStars = (filteredReviewsForStars, spotId)=>{
		let average;
		let total = 0
		for(let i = 0; i <filteredReviewsForStars.length; i++){
			let stars = filteredReviewsForStars[i]
			total += stars
		}
		average = total/filteredReviewsForStars.length
		return average
	}

}
    export default AverageRatingCalc;
