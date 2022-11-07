import { useHistory } from "react-router-dom";
import './TryHosting.css'

const TryHosting = () => {
	const history = useHistory();
	const routeChangeToSignUp = (e) => {
		history.push(`/signup`);
	};

	return (
		<div className="hosting-box">
			<div>
				<h1 className="large-font">Open your door to hosting</h1>
				<button className="button-try-hosting" onClick={routeChangeToSignUp}>
					Try hosting
				</button>
			</div>
		</div>
	);
};

export default TryHosting;
