"use client";

import Link from "next/link";
import styles from "./SignUp.module.css";
import Logo from "../components/Logo";
import HidePwd from "../components/HidePwd";
import CreateAccountBtn from "../components/CreateAccountBtn";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/contexts";
import { apiClient } from "../utils/api";
import { redirect } from "next/navigation";

const default_errors = {
	password: "",
	email: "",
	name: "",
};

export default function SignUp() {
	const { isAuth, setIsAuth, username, setUsername } = useContext(AuthContext);
	const [errors, setErrors] = useState({ ...default_errors });
	const [showModal, setShowModal] = useState(false);
	const handleSignUp = async (e: any) => {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		console.log("formdata:", formData);
		try {
			// redirect('/Home'); // Navigate to Home, uncomment if needed

			const data = await apiClient.post(
				"/signup",
				Object.fromEntries(formData),
			);
			console.log("Signup");

			setShowModal(true);
			// localStorage.setItem('token', data.token);
			// setUsername(data.user.name);
			// setErrors({...default_errors});
			// setIsAuth(true);
			// redirect('/Home');
		} catch (err) {
			console.log("Signup error:", err);

			// Assuming err.cause contains the error response from the API
			// Adjust the structure based on how the error is actually delivered
			const errorResponse = err.cause || {}; // Fallback to empty object if err.cause is undefined

			// Update state with errors returned from the API
			// Using the structure based on your provided error examples
			setErrors({
				password: errorResponse.password ? errorResponse.password[0] : "",
				email: errorResponse.email ? errorResponse.email[0] : "",
				name: errorResponse.name ? errorResponse.name[0] : "",
			});
		}
	};

	useEffect(() => {
		if (isAuth) redirect("/Home");
	}, [isAuth]);
	return (
		<main>
			<div className={styles.SignUp}>
				<div>
					<h1 className={styles.SignUpTitle}>Welcome!</h1>
				</div>
				<div className={styles.Box}>
					<div>
						<h2 className={styles.SignUpSubtitle}>Create Account</h2>
					</div>
					<div className={styles.SignUp3rd}>
						<div className={styles.GoogleSignUp}>
							<Image
								width={0}
								height={0}
								sizes="100vw"
								src="/signup/Google.png"
								className={styles.GoogleIcon}
								alt="google"
							/>
							<p>Sign Up with Google</p>
						</div>
						<div className={styles.FacebookSignUp}>
							<Image
								width={0}
								height={0}
								sizes="100vw"
								src="/signup/Facebook.png"
								className={styles.FacebookIcon}
								alt="facebook"
							/>
							<p>Sign Up with Facebook</p>
						</div>
					</div>
					<div className={styles.Or}>
						<p>-OR-</p>
					</div>
					<form method="POST" onSubmit={handleSignUp}>
						<div className={styles.SignUpInfo}>
							<input
								type="text"
								name="name"
								className={styles.Input}
								placeholder="Full Name"
							></input>
							<br></br>

							<input
								type="text"
								name="email"
								className={styles.Input}
								placeholder="Email"
							></input>
							<br></br>

							<HidePwd name="password"></HidePwd>
							{errors?.password && (
								<span
									className="ml-1 text-error"
									style={{ marginBottom: "10px" }}
								>
									{errors.password}{" "}
									{/* Corrected from errors.email to errors.password */}
								</span>
							)}
							{errors?.email && (
								<span
									className="ml-1 my-2 text-error"
									style={{ marginBottom: "10px" }}
								>
									{errors.email}
								</span>
							)}
							{errors?.name && (
								<span
									className="ml-01my-2 text-error"
									style={{ marginBottom: "10px" }}
								>
									{errors.name}
								</span>
							)}
						</div>
						<div className={styles.SignUpBtn}>
							<CreateAccountBtn showModal={showModal} type="submit" />
						</div>
					</form>
					<div className={styles.Login}>
						<p>Already an account?</p>
						<div className={styles.LoginText}>
							<Link href="/">
								<p>Log in</p>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				src="/start/startpic.png"
				className={styles.SignUpPic}
				alt="sign up"
			/>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				src="/start/background1.png"
				className={styles.SignUpBackground}
				alt="sign up background"
			/>
			<div className={styles.Logo}>
				<Logo></Logo>
			</div>
		</main>
	);
}
