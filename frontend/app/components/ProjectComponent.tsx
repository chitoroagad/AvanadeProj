// FolderDisplay.js or FolderDisplay.tsx if you're using TypeScript
import React from "react";

const ProjectDisplay = ({ text, date, color = "#f4b400" }) => {
	const containerStyle = {
		position: "relative",
		display: "flex",
		alignItems: "center",
		backgroundColor: "whitesmoke",
		padding: "10px 15px",
		borderRadius: "5px", // Slightly round the corners for a softer look
		border: "2px solid #d3d3d3", // Gray border
		fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
		margin: "10px 0",
		cursor: "pointer",
		transition: "box-shadow 0.3s ease", // Smooth shadow transition
		boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
		":before": {
			// CSS pseudo-element for the folder tab effect
			content: '""',
			position: "absolute",
			top: 0,
			left: 20,
			width: "15px",
			height: "10px",
			backgroundColor: "#fff",
			borderTop: "2px solid #d3d3d3",
			borderLeft: "2px solid #d3d3d3",
			borderRadius: "5px 0 0 0",
		},
	};

	const folderIconStyle = {
		fontSize: "22px",
		marginRight: "10px",
		color: color, // Dynamic color based on props
	};

	const textStyle = {
		fontSize: "16px",
		color: "#333",
		fontWeight: "500",
	};

	const dateStyle = {
		fontSize: "14px",
		color: "#666",
		marginLeft: "auto", // Push the date to the right
	};

	return (
		// @ts-ignore
		<div style={containerStyle}>
			<i style={folderIconStyle} className="material-icons">
				project
			</i>
			<span style={textStyle}>{text}</span>
			<span style={dateStyle}>{date}</span>
		</div>
	);
};

export default ProjectDisplay;
