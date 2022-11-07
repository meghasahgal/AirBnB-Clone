import { useHistory } from "react-router-dom";

const TryHosting = () => {
	const history = useHistory();
	const routeChangeToSignUp = (e) => {
		history.push(`/signup`);
	};

	return (
		<div>
			<h1>Open Your Door To Hosting</h1>
			<button onClick={routeChangeToSignUp}>TryHosting</button>
		</div>
	);
};

export default TryHosting;
