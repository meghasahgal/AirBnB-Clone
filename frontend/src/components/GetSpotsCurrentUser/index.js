import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { useEffect } from "react";
import { getSpots } from "../../store/spot";

const GetSpotsCurrentUser = () => {
	const sessionUser = useSelector((state) => state.session.user);
	const history = useHistory();
	const dispatch = useDispatch();
    // const spots = useSelector(state => state.spots)
	const allSpotsArray = useSelector((state) => Object.values(state.spots));
	useEffect(() => {
		dispatch(getSpots());
	}, [dispatch]);

	//get only the spots of where the spot's ownerId = session user
	const spotsCurrentUser = allSpotsArray.filter(
		(spot) => spot.userId === sessionUser.id
	);
    console.log(allSpotsArray, "allSpotsArray")
    // console.log(spot.userId, "spotUserID")
    console.log(sessionUser.id, "sessionUserId")

	return (
		<>
			<div className="spots-container">
				{allSpotsArray.map((spot) => (
					<div key={spot?.id}>
						<div className="spot-details">
							<div
								style={{ backgroundImage: `url('${spot.previewImage}')` }}
								className="img-size primary-text"
							></div>
							<Link to={`/spots/${spot.id}`}>{spot.name}</Link>
							<div className="secondary-text">{spot.city}</div>

							<div className="secondary-text">
								{spot.avgRating}
								{/* <FontAwesomeIcon
									icon={spot.avgRating ? className="fa-solid fa-star" : null}
								/> */}

								<i className="fa-solid fa-star"></i>
							</div>
							<div className="secondary-text">
								{"$"}
								{spot.price}
								{"/night"}
							</div>

							<br></br>
						</div>
					</div>
				))}

			</div>
		</>
	);
};

export default GetSpotsCurrentUser;
