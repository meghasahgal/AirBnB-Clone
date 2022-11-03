import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

const SignupFormPage = () => {
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	// const [errors, setErrors] = useState([]);
	const [validationErrors, setValidationErrors] = useState([]);

	//new error handler
	useEffect(() => {
		const newErrors = [];
		if (!firstName) {
			newErrors.push("First Name field is required");
		}
		if (!lastName) {
			newErrors.push("Last Name field is required");
		}
		if (!email) {
			newErrors.push("Email field is required");
		}
		if (!username) {
			newErrors.push("Username field is required");
		}
		if (!password) {
			newErrors.push("Password field is required");
		}
		if (!confirmPassword  && confirmPassword!== password) {
			newErrors.push(
				"Confirm Password field must be the same as the Password field"
			);
		}

		setValidationErrors(newErrors);
	}, [email, username, password, firstName, lastName, confirmPassword]);

	if (sessionUser) return <Redirect to="/" />;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			setValidationErrors([]);
			return dispatch(
				sessionActions.signUpThunk({
					email,
					username,
					password,
					firstName,
					lastName,
				})
			).catch(async (res) => {
				const data = await res.json();
				// if (data && data.errors) setErrors(data.errors);
			});
		}
		return setValidationErrors([
			"Confirm Password field must be the same as the Password field",
		]);
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				First Name
				<input
					type="text"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					required
				/>
			</label>
			<label>
				Last Name
				<input
					type="text"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required
				/>
			</label>
			<label>
				Email
				<input
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</label>
			<label>
				Username
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
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
			<label>
				Confirm Password
				<input
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
			</label>
			<button className = "sign-up-button"type="submit" disabled={validationErrors.length > 0}>
				Sign Up
			</button>
			<ul>
				{/* {errors.map((error, idx) => (
					<li key={idx}>{error}</li>
				))} */}
				{validationErrors.length > 0 &&
					validationErrors.map((error) => <li key={error}>{error}</li>)}
			</ul>
		</form>
	);
};

export default SignupFormPage;
