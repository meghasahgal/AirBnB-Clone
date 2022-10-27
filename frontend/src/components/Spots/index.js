import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { useEffect } from "react";
import { getSpots } from "../../store/spot";
import "./Spots.css";

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
			<div>
				{allSpotsArray.map((spot) => (
					<div key={spot?.id}>
						<div className="spot-details">
							<div
								style={{ backgroundImage: `url('${spot.previewImage}')` }}
								className="img-size primary-text"
							></div>
							<Link to={`/spots/${spot.id}`}>{spot.name}</Link>
							<div>{spot.city}</div>
							<div>{spot.avgRating}</div>
							<div>{"$"}{spot.price}{"/night"}</div>

							<br></br>
						</div>
					</div>
				))}
				<button onClick={()=>history.push('/spots/create')}>Create Spot</button>
			</div>
		</>
	);
};

export default Spots;
