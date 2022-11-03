import { useHistory } from "react-router-dom";

const PageNotFound = () => {
	const history = useHistory();
	const routeChangeToHome = (e) => {
		history.push(`/spots`);
	};

	return (
		<div>
			<h1>Oops!</h1>
			<p>We can't seem to find the page you're looking for.</p>
			<button onClick={routeChangeToHome}>Go Back To Home</button>
		</div>
	);
};

export default PageNotFound;
