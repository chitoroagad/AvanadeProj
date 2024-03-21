"use client";

import Logo from "../components/Logo";
import styles from "./Home.module.css";
import BtnTab from "../components/BtnTab";
import User from "../components/User";
import Link from "next/link";
import Attachment from "../components/Attachment";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/contexts";
import { redirect } from "next/navigation";

const Home = () => {
	const { isAuth, setIsAuth, username, setUsername } = useContext(AuthContext);
	const [prompt, setPrompt] = useState("");
	useEffect(() => {
		if (!isAuth) {
			redirect("/");
		}
	}, [isAuth]);
	return (
		<main>
			<div className={styles.BtnTab}>
				<BtnTab></BtnTab>
			</div>
			<div className={styles.Search}>
				<Image
					width={0}
					height={0}
					sizes="100vw"
					src="/home/search.png"
					className={styles.SearchPic}
					alt="search"
				/>
				<input
					type="text"
					placeholder="How can I help?"
					className={styles.HomePrompt}
					onChange={(e) => {
						e.preventDefault();
						setPrompt(e.target.value);
					}}
					value={prompt}
				/>
				<Attachment setPrompt={setPrompt} />
			</div>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				src="/start/background1.png"
				className={styles.HomeBackground}
				alt="home background"
			/>
			{/* <div className={styles.logo}><Logo></Logo></div> */}
			<div className={styles.GenBtn}>
				<Link href="/Process">
					<button className="btn btn-wide btn-primary">Generate</button>
				</Link>
			</div>
			<User></User>
		</main>
	);
};

export default Home;
