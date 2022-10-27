import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getSpotById, deleteSpot } from "../../store/spot";

const DeleteSpot = () => {
	const sessionUser = useSelector((state) => state.session.user);
	const history = useHistory();
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const spot = useSelector((state) => state.spots[spotId]);
    console.log(spot, "spot")
    console.log(spotId, "spotId")

    //checking if the spot belongs to the current session user
	if (!sessionUser || sessionUser.id !== spot.userId) {
		return <div>You cannot delete a spot that you do not own.</div>;
	}

    //to prevent the page from re-loading on click and dispatching the delete action creator
	const handleDeleteClick = (e) => {
		e.preventDefault();
        dispatch(deleteSpot(spot.id))
		history.push(`/spots`);
	};


    const handleCancelClick = (e) => {
		history.push(`/spots/${spot.id}`);
	};

	return (
		<div>
			<h1>Are you sure you want to delete this {spot.name} spot?</h1>
            <br></br>
            <br></br>
            <br></br>
            <button onClick={handleDeleteClick}>Delete</button>
            <button onClick={handleCancelClick}>Cancel</button>

		</div>
	);
};

export default DeleteSpot;
