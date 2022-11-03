import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSpots } from "../../store/spot";
import AverageRatingCalc from "../AverageRatingCalc"
import "./Spots.css";
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons";

const Spots = () => {
	const allSpotsArray = useSelector((state) => Object.values(state.spots));

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getSpots());
	}, [dispatch]);

	//button route change for creating a spot
	const history = useHistory();
	// const routeChange = () => {
	// 	let path = `/spots/create`;
	// 	history.push(path);
	// };

	//need to add race case for spot? here too
	return (
		<> <hr></hr>
			<div></div>
			<div></div>
			<div></div>
			<button className="btn-create-spot" onClick={() => history.push("/spots/create")}>Create Spot</button>
			<div></div>
			<div className="spots-container">
				{allSpotsArray.map((spot) => (
					<div key={spot?.id}>
						<div className="spot-details">
							<div
								style={{ backgroundImage: `url('${spot.previewImage}')` }}
								className="img-size primary-text"
							>
								<FontAwesomeIcon className="heart" icon={faHeart} />
							</div>
							<Link className="spot-link" to={`/spots/${spot.id}`}>{spot.name}</Link>
							<div className="secondary-text">
								{spot.city}
								{","} {spot.state}
							</div>

							<div className="secondary-text">
					
								<AverageRatingCalc spot={spot} />
								{/* <i className="fa-solid fa-star"></i> */}
							</div>
							<div className="secondary-text">
								{"$"}
								{spot.price}
								{" night"}
							</div>

							<br></br>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default Spots;
