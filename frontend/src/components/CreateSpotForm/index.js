import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSpot } from "../../store/spot";

const CreateSpotForm = () => {

    const sessionUser = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const history = useHistory();

    //set state variables
    const[disabled, setDisabled] =useState(false);
	const [id, setId] = useState();
	const [userId, setUserId] = useState();
	const [address, setAddress] = useState();
	const [city, setCity] = useState();
	const [state, setState] = useState();
	const [country, setCountry] = useState();
	const [lat, setLat] = useState();
	const [lng, setLng] = useState();
	const [name, setName] = useState();
	const [description, setDescription] = useState();
	const [price, setPrice] = useState();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
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
		};

		let createdSpot = await dispatch(createSpot(payload));
		if (createdSpot) {
			history.push(`/spots/${createdSpot.id}`);
			// hideForm();
		}
	};

	const handleCancelClick = (e) => {
		e.preventDefault();
        
		// hideForm();
	};

	return (
		<div>
			<section className="new-form-holder">
				<form className="create-spot-form" onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Enter address"
						required
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Enter city"
						required
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Enter state"
						required
						value={state}
						onChange={(e) => setState(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Enter country"
						required
						value={country}
						onChange={(e) => setCountry(e.target.value)}
					/>
					<input
						type="number"
						placeholder="Enter latitude"
						required
						value={lat}
						onChange={(e) => setLat(e.target.value)}
					/>
					<input
						type="number"
						placeholder="Enter longitude"
						required
						value={lng}
						onChange={(e) => setLng(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Enter name"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Enter description"
						required
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<input
						type="number"
						placeholder="Enter price per day"
						required
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
					{/* <select onChange={updateType} value={type}>
						{pokeTypes.map((type) => (
							<option key={type}>{type}</option>
						))}
					</select> */}
					<button type="submit">Create Spot</button>
					<button type="button" onClick={handleCancelClick}>
						Cancel
					</button>
				</form>
			</section>
		</div>
	);
};

export default CreateSpotForm;
// const payload = {
// 	id: newSpot.id,
// 	userId: newSpot.userId,
// 	address: newSpot.address,
// 	city: newSpot.city,
// 	state: newSpot.state,
// 	country: newSpot.country,
// 	lat: newSpot.lat,
// 	lng: newSpot.lng,
// 	name: newSpot.name,
// 	description: newSpot.description,
// 	price: newSpot.price,
// 	createdAt: newSpot.createdAt,
// 	updatedAt: newSpot.updatedAt,
// };
