import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getSpots } from "../../store/spot";
import "./Spots.css";

const Spots = () => {
	const allSpotsArray = useSelector((state) => Object.values(state.spots));
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getSpots());
	}, [dispatch]);

	return (
		<>
			<div>
				{allSpotsArray.map((spot) => (
					<li key={spot?.id}>
						<div>
							<div
								style={{ backgroundImage: `url('${spot.previewImage}')` }}
								className="img-size"
							></div>
							<div>{spot.city}</div>
							<div>{spot.avgRating}</div>
							<div>{spot.price}</div>
						</div>
					</li>
				))}
			</div>
		</>
	);
};

export default Spots;
