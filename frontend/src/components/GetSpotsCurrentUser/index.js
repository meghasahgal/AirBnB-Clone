import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getSpots } from "../../store/spot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const GetSpotsCurrentUser = () => {
	const sessionUser = useSelector((state) => state.session.user);
	const dispatch = useDispatch();
	const allSpotsArray = useSelector((state) => Object.values(state.spots));
	useEffect(() => {
		dispatch(getSpots());
	}, [dispatch]);

	//get only the spots of where the spot's ownerId = session user
	const spotsCurrentUser = allSpotsArray.filter(
		(spot) => spot.userId === sessionUser.id
	);

	return (
		<>
			<div className="spots-container">
				{spotsCurrentUser.map((spot) => (
					<div key={spot?.id}>
						<div className="spot-details">
							<div
								style={{ backgroundImage: `url('${spot.previewImage}')` }}
								className="img-size primary-text"
							></div>
							<Link to={`/spots/${spot.id}`}>{spot.name}</Link>
							<div className="secondary-text">
								{spot.city}
								{","} {spot.state}
							</div>

							<div className="secondary-text">
								{spot.avgRating}
								{/* <{spot.avgRating?FontAwesomeIcon icon= "fa-solid fa-star":null} /> */}
								<FontAwesomeIcon icon={spot.avgRating ? faStar : null} />
								
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
