"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure Axios is installed
import styles from "./CreateSpace.module.css";

import { apiClient } from "@/app/utils/api";

const CreateSpace = () => {
	// State setup for form fields
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [group, setGroup] = useState("");
	const [tags, setTags] = useState([]);
	const [groups, setGroups] = useState([]);
	const [newTag, setNewTag] = useState("");

	// Function to add a new tag
	const addTag = () => {
		if (newTag && !tags.find((t) => t.name === newTag)) {
			setTags([...tags, { name: newTag, color: "#05a386" }]); // Mock ID and color
			setNewTag("");
		}
	};

	// Fetch groups from the backend
	useEffect(() => {
		apiClient
			.get("/spaces/groups", {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + localStorage.getItem("token"),
				},
			})
			.then((response) => response.json())
			.then(setGroups)
			.catch(console.error);
	}, []);

	// Function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = {
			name,
			description,
			group,
			tags: tags, // Assuming your backend expects tag IDs
		};

		console.log(formData);
		// Updated part: Convert formData to JSON
		apiClient
			.post("/spaces/", formData) // Convert formData to JSON string
			.then((data) => {
				console.log(data, "Data<<<<<<");
				alert("Space has been created successfully");
				// Redirect if necessary
			})
			.catch((error) => {
				console.error("Error:", error);
				alert("Error creating space. Please try again.");
			});
	};

	return (
		<div className={styles.container}>
			<h1>Create a New Space</h1>
			<form className={styles.form} onSubmit={handleSubmit}>
				<input
					className={styles.input}
					type="text"
					value={name}
					placeholder="Name"
					onChange={(e) => setName(e.target.value)}
				/>
				<textarea
					className={styles.textarea}
					value={description}
					placeholder="Description"
					onChange={(e) => setDescription(e.target.value)}
				/>
				<select
					className={styles.select}
					value={group}
					onChange={(e) => setGroup(e.target.value)}
				>
					<option value="">Select a group</option>
					{groups.map((g) => (
						<option key={g.id} value={g.id}>
							{g.name}
						</option>
					))}
				</select>
				<div className={styles.tagsInput}>
					<input
						className={styles.input}
						type="text"
						value={newTag}
						placeholder="Add a tag"
						onChange={(e) => setNewTag(e.target.value)}
						onKeyUp={(e) => e.key === "Enter" && addTag()}
					/>
					<button type="button" onClick={addTag} className={styles.tagButton}>
						Add
					</button>
				</div>
				<div className={styles.tagsDisplay}>
					{tags.map((tag, index) => (
						<span key={index} className={styles.tag}>
							{tag.name}
						</span>
					))}
				</div>
				<button type="submit" className={styles.button}>
					Create Space
				</button>
			</form>
		</div>
	);
};

export default CreateSpace;
