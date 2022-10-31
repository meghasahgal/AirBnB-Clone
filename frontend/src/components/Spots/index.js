import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSpots } from "../../store/spot";
import "./Spots.css";
import {
	faSearch,
	faHeart,
	faGlobe,
	faUser,
	faBars,
	faStar
} from "@fortawesome/free-solid-svg-icons";

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
								{/* <{spot.avgRating?FontAwesomeIcon icon= "fa-solid fa-star":null} /> */}
								<FontAwesomeIcon icon={spot.avgRating ? faStar : null} />
								{/* <FontAwesomeIcon
									icon={spot.avgRating ? className="fa-solid fa-star" : null}
								/> */}

								{/* <i className="fa-solid fa-star"></i> */}
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
				<button onClick={() => history.push("/spots/create")}>
					Create Spot
				</button>
			</div>
		</>
	);
};

export default Spots;
