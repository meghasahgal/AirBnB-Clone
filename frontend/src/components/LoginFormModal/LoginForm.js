// frontend/src/components/LoginFormPage/index.js

import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "../Navigation/Navigation.css"
import { useHistory } from "react-router-dom";
import "./LoginForm.css"

function LoginForm() {
	const dispatch = useDispatch();
	const history = useHistory();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([]);


	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors([]);
		return dispatch(sessionActions.logInThunk({ credential, password })).catch(
			async (res) => {
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
			}
		);
	};

	//handle click function
	const handleCancelClick = (e) => {
		e.preventDefault();
		history.push(`/spots`);

		// hideForm();
	};

	return (
		<form className="login-form" onSubmit={handleSubmit}>
			<ul>
				{errors.map((error, idx) => (
					<li key={idx}>{error}</li>
				))}
			</ul>
			<div className="text-elements">
				<label>
					Username or Email
					<input
						type="text"
						value={credential}
						onChange={(e) => setCredential(e.target.value)}
						required
					/>
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
			</div>
			<button className="login-button" type="submit">Log In</button>
			{/* <button onClick={handleCancelClick}>Cancel</button> */}
		</form>
	);
}

export default LoginForm;
