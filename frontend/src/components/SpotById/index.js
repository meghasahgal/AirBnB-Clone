import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpotById } from "../../store/spot";
import EditSpotForm from "../EditSpotForm";
import "./SpotById.css"

const SpotById = () =>{
const history = useHistory();
const dispatch = useDispatch();
const {spotId} = useParams();
const spot = useSelector((state) => state.spots[spotId])
const sessionUser  = useSelector((state)=> state.session.user)
const [showEditSpotForm, setShowEditSpotForm] = useState(false);

useEffect(() => {
	dispatch(getSpotById(spotId));
}, [spotId]);

// //button to edit
	const routeChangetoEditForm = () => {
		let path = `/spots/${spotId}/edit`;
		history.push(path)

	};

    //  console.log(history, "history");
// // //button to delete
const routeChangetoDelete = () => {
	let path = `/spots/${spotId}/delete`;
	history.push(path);
};
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
			     <button onClick={routeChangetoEditForm}>Edit Spot</button>
				<button onClick={routeChangetoDelete}>Delete Spot</button>
			</div>
		);
				{/* <button onClick={routeChangetoEditForm}>Edit Spot</button>
				<button onClick={routeChangetoDelete}>Delete Spot</button> */}

				{/* <div>
					<EditSpotForm />
				</div> */}

}

export default SpotById;
