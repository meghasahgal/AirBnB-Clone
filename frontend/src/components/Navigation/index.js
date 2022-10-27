import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import "./Navigation.css";
import logo from "../../images/navigation/logo.png"

function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);
	// console.log(sessionUser)
	//if logged in
	let sessionLinks;
	if (sessionUser) {
		sessionLinks = <ProfileButton user={sessionUser} />;
	//else redirect to signing up
	} else {
		sessionLinks = (
			<>
				<NavLink to="/signup">Sign Up</NavLink>

				<LoginFormModal />
			</>
		);
	}

	return (
		<nav>
			<ul>
				<div>
					<NavLink exact to="/">
						{/* Home */}
						<div className="image-container">
							<img className="logo" src={logo} alt="logo"></img>
						</div>
					</NavLink>{" "}
					{isLoaded && sessionLinks}
				</div>
			</ul>
		</nav>
	);
}

export default Navigation;
