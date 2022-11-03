import { useDispatch } from "react-redux";
import { loginThunk } from "../../store/session";

const DemoUser = () => {
	const dispatch = useDispatch();

	const user = {
		credential: "meghasahgal",
		password: "monkey",
	};

	const handleClick = (e) => {
		e.preventDefault();
		return dispatch(loginThunk(user));
	};

    return (<div></div>)
}
