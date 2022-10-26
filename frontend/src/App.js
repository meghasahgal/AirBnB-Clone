import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
// import LoginFormPage from "./components/LoginFormModal";
import * as sessionActions from "./store/session";
import SignupFormPage from "./components/SignupFormPage";
import CreateSpotForm from "./components/CreateSpotForm";
import Spots from "./components/Spots";
import SpotById from "./components/SpotById";
import Navigation from "./components/Navigation";
import { loadSpotsActionCreator, getSpots } from "./store/spot";

function App() {
	const loggedIn = useSelector((state) => state.user);
	console.log(loggedIn, 'loggedIn')
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
					<Route exact path="/signup">
						<SignupFormPage />
					</Route>
					<Route exact path={["/", "/spots"]}>
						<Spots />
					</Route>
					<Route exact path="/spots/:spotId">
						<SpotById />
					</Route>
					<Route exact path="/spots/new">
						<CreateSpotForm />
					</Route>
					<Route path="/">
						"Page Not Found"
					</Route>
				</Switch>
			)}
		</>
	);
}

export default App;
