import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSpot } from "../../store/spot";
import "./CreateSpotForm.css"

const CreateSpotForm = () => {

    const sessionUser = useSelector((state) => state.session.user);
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
    const [previewImage, setPreviewImage] = useState();
	const [validationErrors, setValidationErrors] = useState([]);




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
            previewImage
		}


// 	 setErrors([]);
//   	 dispatch(createSpot(payload)).catch(
//       async (res) => {
//         const data = await res.json();
//         if (data && data.errors) setErrors(data.errors);
// 		console.log(data.errors, "data errors")
//       }
//     );
// }
		try{
		let createdSpot = await dispatch(createSpot(payload));
		// console.log("this is created spot",createdSpot)
		// if (createdSpot.Array.isArray([errors])) {
		// 	history.push(`/spots/${createdSpot.id}`);
		// 	// hideForm();
		// }
		// else
	} catch(e){
		const response = await e.json()
		console.log(response)
		const errors = new Set(response.errors)
		console.log(errors)
		const errorsArray = Array.from(errors)
		// if(errors) setErrors[errors]
		// console.log(errorsArray, "errorsArray")
		// setErrors[errorsArray]
	}

	}

//new error handler
		useEffect(() => {
			const newErrors = [];
			if (!address) {
				newErrors.push("Address field is required");
			}
			if (!city) {
				newErrors.push("City field is required");
			}
			if (!state) {
				newErrors.push("State field is required");
			}
			if (!country) {
				newErrors.push("Country field is required");
			}
			if (!lat || lat % 1 === 0) {
				newErrors.push("Latitude field is a required decimal value");
			}
			if (!lng) {
				newErrors.push("Longitude field is a required decimal value");
			}
			if (!name) {
				newErrors.push("Name field is required");
			}
			// if (name.length > 50) {
			// 	newErrors.push("Name field must be less than 50 characters");
			// }
			if (!description) {
				newErrors.push("Description field is required");
			}
			if (!price) {
				newErrors.push("Price field is required");
			}
			if (!previewImage) {
				newErrors.push("Image field is required");
			}

			setValidationErrors(newErrors);
		}, [
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
		]);

	//handle click function
	const handleCancelClick = (e) => {
		e.preventDefault();
		history.push(`/spots`)

		// hideForm();
	};

	return (
		<div>
			<h1>Create a Spot</h1>

			<section className="new-form-holder">
				<form className="create-spot-form" onSubmit={handleSubmit}>
					<div>Address</div>
					<input
						type="text"
						placeholder="Enter address"
						// required
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
					{/* <ErrorMessage label={"Address"} message={} /> */}
					<div>City</div>
					<input
						type="text"
						placeholder="Enter city"
						// required
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
					<div>State</div>
					<input
						type="text"
						placeholder="Enter state"
						// required
						value={state}
						onChange={(e) => setState(e.target.value)}
					/>
					<div>Country</div>
					<input
						type="text"
						placeholder="Enter country"
						// required
						value={country}
						onChange={(e) => setCountry(e.target.value)}
					/>
					<div>Latitude</div>
					<input
						type="number"
						placeholder="Enter latitude"
						// required
						value={lat}
						onChange={(e) => setLat(e.target.value)}
					/>
					<div>Longitude</div>
					<input
						type="number"
						placeholder="Enter longitude"
						// required
						value={lng}
						onChange={(e) => setLng(e.target.value)}
					/>
					<div>Name</div>
					<input
						type="text"
						placeholder="Enter name"
						// required
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<div>Description</div>
					<input
						type="text"
						placeholder="Enter description"
						// required
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<div>Price</div>
					<input
						type="number"
						placeholder="Enter price per day"
						// required
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
					<br></br>
					<br></br>
					<div className="create-spot-forms-buttons">
						<button type="submit" disabled={validationErrors.length > 0}>
							Create Spot
						</button>
						<button type="button" onClick={handleCancelClick}>
							Cancel
						</button>
					</div>
					<ul className="errors">
						{validationErrors.length > 0 &&
							validationErrors.map((error) => <li key={error}>{error}</li>)}
					</ul>
				</form>
			</section>
		</div>
	);
};

export default CreateSpotForm;
