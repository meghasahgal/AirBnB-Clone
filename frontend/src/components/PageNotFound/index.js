import { useHistory } from "react-router-dom";

const PageNotFound = () => {
	const history = useHistory();
	const routeChangeToHome = (e) => {
		history.push(`/spots`);
	};

	return (
		<div>
			<p>No Page Found</p>
			<button onClick={routeChangeToHome}>Go Back To Home</button>
		</div>
	);
};

export default PageNotFound;
