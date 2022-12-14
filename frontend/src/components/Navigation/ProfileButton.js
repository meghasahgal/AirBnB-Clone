import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars
} from "@fortawesome/free-solid-svg-icons";
import "./Navigation.css"

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);

	const openMenu = () => {
		if (showMenu) return;
		setShowMenu(true);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = () => {
			setShowMenu(false);
		};
        //when showMenu is true, add event listener
		document.addEventListener("click", closeMenu);
        //close the listener
		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);

	const logout = (e) => {
		e.preventDefault();
		dispatch(sessionActions.logOutThunk());
	};

	return (
		<>
			<div className="profile">
				<button className="btn-profile" onClick={openMenu}>
					<FontAwesomeIcon icon={faBars} />
					<i className="fas fa-user-circle" />
				</button>
				{showMenu && (
					<ul className="profile-dropdown">
						<li>{user.username}</li>
						<li>{user.email}</li>
						<li>
							<button onClick={logout}>Log Out</button>
						</li>
					</ul>
				)}
			</div>
		</>
	);
}

export default ProfileButton;
