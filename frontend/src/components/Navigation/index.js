import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import "./Navigation.css";
import logo from "../../images/navigation/logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faHeart, faGlobe,faUser,faBars} from '@fortawesome/free-solid-svg-icons'
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
		<div className="header">
			<ul>
				<div>
					<NavLink exact to="/">
						<div className="image-container">
							<img className="logo" src={logo} alt="logo"></img>
						</div>
					</NavLink>{" "}
				</div>
			</ul>

			{/* second  */}
			<div className="search-bar">
				<input type="text" />
				<FontAwesomeIcon icon={faSearch} />
			</div>

			{/* third section	 */}

			<div className="host-login">
				<p>Become a Host</p>
				<FontAwesomeIcon icon={faGlobe} />
				<ul>
					<div>
						<NavLink exact to="/"></NavLink> {isLoaded && sessionLinks}
					</div>
				</ul>
			</div>

		</div>
	);
}

export default Navigation;
