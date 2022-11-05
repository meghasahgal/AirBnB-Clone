import { useDispatch } from "react-redux";
import { loginThunk } from "../../store/session";

const DemoUser = () => {
	const dispatch = useDispatch();

	const user = {
		credential: "demo@user.io",
		password: "password",
	};

	const handleClick = (e) => {
		e.preventDefault();
		return dispatch(loginThunk(user));
	};

    return (<div></div>)
}
