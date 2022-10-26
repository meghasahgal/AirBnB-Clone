import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpotById } from "../../store/spot";
import "./SpotById.css"

const SpotById = () =>{
const dispatch = useDispatch();
const {spotId} = useParams();
const spot = useSelector((state) => state.spots[spotId])
const sessionUser  = useSelector((state)=> state.session.user)
// const [showEditSpotForm, setShowEditSpotForm] = useState(false);

useEffect(() => {
	dispatch(getSpotById(spotId));
}, [spotId]);

    return (
			<div>
				<div></div>
				<div></div>
				<div></div>
				<div
					className="img-size primary-text"
					style={{ backgroundImage: `url('${spot.previewImage}')` }}
				></div>
				<div>{spot.city}</div>
				<div>{spot.location}</div>
				<div>{spot.description}</div>
				<div>{spot.avgRating}</div>
			</div>
		);
}

export default SpotById;
