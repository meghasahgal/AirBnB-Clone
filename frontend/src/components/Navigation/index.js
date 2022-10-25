import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);
	// console.log(sessionUser)

	let sessionLinks;
	if (sessionUser) {
		sessionLinks = <ProfileButton user={sessionUser} />;
		
	} else {
		sessionLinks = (
			<>
				<NavLink to="/signup">Sign Up</NavLink>

				<LoginFormModal />
			</>
		);
	}

	return (
		<ul>
			<div>
				<NavLink exact to="/">
					Home
				</NavLink>	{isLoaded && sessionLinks}
			</div>
		</ul>
	);
}

export default Navigation;
