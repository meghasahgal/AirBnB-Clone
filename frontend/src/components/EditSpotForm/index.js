import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createSpot, editSpot, getSpots } from "../../store/spot";


const EditSpotForm = () => {
    const {spotId} = useParams()
	const sessionUser = useSelector((state) => state.session.user);
    const spot = useSelector((state) =>state.spots[spotId])
    // console.log(spot, "spot")
	const dispatch = useDispatch();
	const history = useHistory();

	//set state variables
	const [disabled, setDisabled] = useState(false);
	const [id, setId] = useState(spot.id);
	const [userId, setUserId] = useState(spot.userId);
	const [address, setAddress] = useState(spot.address);
	const [city, setCity] = useState(spot.city);
	const [state, setState] = useState(spot.state);
	const [country, setCountry] = useState(spot.country);
	const [lat, setLat] = useState(spot.lat);
	const [lng, setLng] = useState(spot.lng);
	const [name, setName] = useState(spot.name);
	const [description, setDescription] = useState(spot.description);
	const [price, setPrice] = useState(spot.price);
	const [previewImage, setPreviewImage] = useState(spot.previewImage);

    //get all spots to see if user id is equal to the session user id
    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])

    //redirect user back to spot
    function handleGoBackClick(e) {
        history.push(`/spots/${spot.id}`);
    }

    if(!sessionUser || sessionUser.id !== spot.userId){
        return (
					<div>
						<div> You cannot edit a spot you do not own.</div>
                        <button onClick={handleGoBackClick}>Go Back to Spot</button>
					</div>
				);
    }
	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
            ...spot,
			id,
			userId,
			address,
			city,
			state,
			country,
			lat,
			lng,
			name,
			description,
			price,
			previewImage,
		};

		let editedSpot = await dispatch(editSpot(spot.id, payload));
        console.log(editedSpot, "editedSpot");
		if (editedSpot) {
			history.push(`/spots/${editedSpot.id}`);
			// hideForm();
		}
	};

	const handleCancelClick = (e) => {
		e.preventDefault();
        history.push(`/spots/${spot.id}`);
		// hideForm();
	};
    // NEED TO ADD VALIDATION ERRORS

	return (
		<div>
            <p>Edit Spot</p>
			<section className="edit-form-holder">
				<form className="edit-spot-form" onSubmit={handleSubmit}>
                    <div>Address</div>
					<input
						type="text"
						placeholder="Update address"
						required
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
                    <div>City</div>
					<input
						type="text"
						placeholder="Update city"
						required
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
                    <div>State</div>
					<input
						type="text"
						placeholder="Update state"
						required
						value={state}
						onChange={(e) => setState(e.target.value)}
					/>
                    <div>Country</div>
					<input
						type="text"
						placeholder="Update country"
						required
						value={country}
						onChange={(e) => setCountry(e.target.value)}
					/>
                    <div>Latitude</div>
					<input
						type="number"
						placeholder="Update latitude"
						required
						value={lat}
						onChange={(e) => setLat(e.target.value)}
					/>
                    <div>Longitude</div>
					<input
						type="number"
						placeholder="Update longitude"
						required
						value={lng}
						onChange={(e) => setLng(e.target.value)}
					/>
                    <div>Name</div>
					<input
						type="text"
						placeholder="Update name"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
                    <div>Description</div>
					<input
						type="text"
						placeholder="Update description"
						required
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
                    <div>Price</div>
					<input
						type="number"
						placeholder="Update price per day"
						required
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
                    <div>Image</div>
					<input
						type="text"
						placeholder="Enter an image URL"
						value={previewImage}
						onChange={(e) => setPreviewImage(e.target.value)}
					/>

                    
					<button type="submit">Edit Spot</button>
					<button type="button" onClick={handleCancelClick}>
						Cancel
					</button>
				</form>
			</section>
		</div>
	);
};

export default EditSpotForm;
