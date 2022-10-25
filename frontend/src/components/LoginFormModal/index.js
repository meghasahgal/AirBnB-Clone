import React, { useState } from "react";
import {useSelector} from 'react-redux'
import {Redirect} from 'react-router-dom'
import { Modal } from "../../context/Modal"
import LoginForm from "./LoginForm";

function LoginFormModal() {
	const [showModal, setShowModal] = useState(false);
	 const sessionUser = useSelector((state) => state.user);

	if (sessionUser) return <Redirect to="/" />;

	return (
		<>
			<button onClick={() => setShowModal(true)}>Log In</button>
			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<LoginForm />
				</Modal>
			)}
		</>
	);
}

export default LoginFormModal;
