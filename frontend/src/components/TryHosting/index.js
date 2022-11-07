import { useHistory } from "react-router-dom";
import {useSelector} from "react-redux";
import './TryHosting.css'

const TryHosting = () => {
    const sessionUser = useSelector((state) => state.session.user);
	const history = useHistory();
	const routeChangeToSignUp = (e) => {
		history.push(`/signup`);
	};

    const routeChangeToCreateSpot = (e) => {
			history.push(`/spots/create`);
		};



	return (
		<div className="hosting-box">
			<div>
				<h1 className="large-font">Open your door to hosting</h1>
				<div>
					{sessionUser ? (
						<button
							className="button-try-hosting"
							onClick={routeChangeToCreateSpot}
						>
							Create Spot
						</button>
					) : (
						<button
							className="button-try-hosting"
							onClick={routeChangeToSignUp}
						>
							Try hosting
						</button>
					)}
				</div>
			</div>
		</div>
	);
                }

export default TryHosting;
