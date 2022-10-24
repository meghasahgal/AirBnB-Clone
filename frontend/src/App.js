import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
// import LoginFormPage from "./components/LoginFormModal";
import * as sessionActions from "./store/session";
import SignupFormPage from "./components/SignupFormPage";
import Spots from "./components/Spots";
import Navigation from "./components/Navigation";
import { loadSpotsActionCreator, getSpots } from "./store/spot";

function App() {
	const loggedIn = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		dispatch(sessionActions.restoreSessionThunk()).then(() =>
			setIsLoaded(true)
		);
		//need to dispatch getSpots function w/i the useEffect to get all spots -- called it in the Spots comp
		// dispatch(getSpots());
	}, [dispatch]);

	return (
		<>
			<Navigation isLoaded={isLoaded} />
			{isLoaded && (
				<Switch>
					<Route path="/signup">
						<SignupFormPage />
					</Route>
					{/* {loggedIn &&( */}
					<Route path="/spots">
						<Spots />
					</Route>
					{/* )} */}
				</Switch>
			)}
		</>
	);
}

export default App;
