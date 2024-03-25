"use client";

import styles from "./NewChat.module.css";
import AlterTask from "../components/AlterTask";
import NotConfirmedTask from "../components/NotConfirmedTask";
import NoHelloUser from "../components/NoHelloUser";
import DownloadPdf from "../components/DownloadPdf";
import Image from "next/image";

const NewChat = () => {
	return (
		<main>
			{/* <div className={styles.maintab}><MainTab></MainTab></div> */}
			<div className={styles.chatName}>
				<h1>Chat name</h1>
			</div>
			<div className={styles.prompt}>
				<Image
					width={0}
					height={0}
					sizes="100vw"
					src="/home/search.png"
					className={styles.promptPic}
					alt="prompt"
				/>
				<input
					type="text"
					placeholder="Prompt: typed"
					className={styles.promptText}
					disabled={true}
				></input>
				<button className={styles.regenBtn}>
					<AlterTask initialText="Regenerate Response"></AlterTask>
				</button>
				<button className={styles.restrBtn}>
					<NotConfirmedTask initialText="Task Restructure"></NotConfirmedTask>
				</button>
			</div>
			<div className={styles.responseTag}>
				<h1>Response</h1>
			</div>
			<div className={styles.response}>
				<p id="text-to-download">Example Response</p>
			</div>
			<div className={styles.download}>
				<DownloadPdf></DownloadPdf>
			</div>
			<div className={styles.newchatBackground}>
				<Image
					width={0}
					height={0}
					sizes="100vw"
					src="/process/background2.png"
					alt="process"
				/>
			</div>
			<NoHelloUser></NoHelloUser>
		</main>
	);
};

export default NewChat;
