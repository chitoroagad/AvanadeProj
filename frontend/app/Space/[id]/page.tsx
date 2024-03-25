"use client";
import React, { useEffect, useState } from "react";

import { apiClient } from "@/app/utils/api"; // Adjust the import path according to your project structure
import {
	Container,
	Grid,
	Typography,
	Paper,
	Chip,
	Box,
	Card,
	CardContent,
	IconButton,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	DialogContentText,
	List,
	ListItem,
	ListItemText,
	Checkbox,
	Button,
	Avatar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FolderIcon from "@mui/icons-material/Folder";
import TagIcon from "@mui/icons-material/Label";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import GroupIcon from "@mui/icons-material/Group"; // Import if using GroupIcon
import EventNoteIcon from "@mui/icons-material/EventNote"; // Import if using EventNoteIcon
import ApartmentIcon from "@mui/icons-material/Apartment";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";

const Space = ({ params }) => {
	const [space, setSpace] = useState(null);
	const [selectedFolderId, setSelectedFolderId] = useState(null);
	const [folders, setFolders] = useState([]);
	const [chats, setChats] = useState([]);
	const [folderChats, setFolderChats] = useState([]);

	const [selectedChats, setSelectedChats] = useState(new Set());
	const [dialogOpen, setDialogOpen] = useState(false);
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Fetch space details
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				apiClient
					.get(`/spaces/${params.id}`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: "Token " + localStorage.getItem("token"),
						},
					})
					.then((response) => response.json())
					.then((data) => {
						console.log(data);

						setSpace(data);
						setLoading(false); // Stop loading after the data is received
					})
					.catch((error) => {
						console.error("Error:", error);
						setLoading(false); // Stop loading after the data is received
					});

				// Assuming your API has an endpoint to fetch folders for a space
				apiClient
					.get(`spaces/${params.id}/folders?space_id=${params.id}`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: "Token " + localStorage.getItem("token"),
						},
					})
					.then((response) => response.json())
					.then((data) => {
						console.log(data);

						setFolders(data);
						setLoading(false); // Stop loading after the data is received
					})
					.catch((error) => {
						console.error("Error:", error);
						setLoading(false); // Stop loading after the data is received
					});

				// setFolders(foldersData);
			} catch (error) {
				-console.error("Error:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [params.id]);

	useEffect(() => {
		const getChats = async () => {
			try {
				const response = await apiClient.get("/chats", {
					headers: {
						Authorization: "Token " + localStorage.getItem("token"),
					},
				});
				if (response.ok) {
					const data = await response.json();
					setChats(data.chats);
				} else if (response.status == 401) {
					console.log("errorrr");
				}
			} catch (err) {
				console.log("chats errors:", err);
			}
		};
		getChats();
	}, []);

	const handleSelectChat = (chatId) => {
		const newSelectedChats = new Set(selectedChats);
		if (newSelectedChats.has(chatId)) {
			newSelectedChats.delete(chatId);
		} else {
			newSelectedChats.add(chatId);
		}
		setSelectedChats(newSelectedChats);
	};

	const assignChatsToFolder = async (folderId) => {
		try {
			await apiClient.post(`/assign-chats-to-folder/`, {
				folder_id: selectedFolderId,
				chats: Array.from(selectedChats),
				headers: {
					Authorization: "Token " + localStorage.getItem("token"),
				},
			});
			// Close dialog and clear selections
			setDialogOpen(false);
			setSelectedChats(new Set());
			// Optionally refresh data here
		} catch (error) {
			console.error("Error assigning chats to folder: ", error);
		}
	};

	if (loading) return <Typography>Loading...</Typography>;
	if (error) return <Typography>Error: {error}</Typography>;
	if (!space) return <Typography>No space data found</Typography>;
	const handleSetDialogOpen = (id) => {
		setDialogOpen(true);
		setSelectedFolderId(id);
	};
	const folderDetailSetDialogOpen = (id) => {
		setDetailDialogOpen(true);
		const getFolderChats = async () => {
			try {
				const response = await apiClient.get(`/chats/folder/${id}`, {
					headers: {
						Authorization: "Token " + localStorage.getItem("token"),
					},
				});
				if (response.ok) {
					const data = await response.json();
					setFolderChats(data.chats);
				} else if (response.status == 401) {
					console.log("errorrr");
				}
			} catch (err) {
				console.log("chats errors:", err);
			}
		};
		getFolderChats();
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDeleteSpace = () => {
		console.log("Delete action triggered");
		apiClient
			.delete(`/spaces/${params.id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + localStorage.getItem("token"),
				},
			})
			.then((response) => {
				setIsDeleted(true);
			})
			.then((data) => {
				setIsDeleted(true);
				console.log(data, "Closeee");

				// You might want to navigate away or refresh the list here
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	return (
		<Container maxWidth="lg" sx={{ mt: 4, marginLeft: "20%" }}>
			<div style={{ float: "right" }}>
				<IconButton
					style={{ color: "red" }}
					onClick={handleClickOpen} // Open dialog
					aria-label="delete"
				>
					<DeleteIcon />
				</IconButton>
				<Dialog
					open={open}
					onClose={(event, reason) => {
						if (
							reason !== "backdropClick" &&
							reason !== "escapeKeyDown" &&
							!isDeleted
						) {
							handleClose(); // Only executes handleClose if the dialog wasn't closed by clicking outside or pressing escape
						}
					}}
					disableEscapeKeyDown // Prevents closing the dialog by pressing the Escape key
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Confirm Deletion"}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{isDeleted
								? "The space has been successfully deleted."
								: "Are you sure you want to delete this space?"}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						{isDeleted ? (
							<Link color="primary" href={"/Spaces"} legacyBehavior>
								<Button className="btn btn-primary">Okay</Button>
							</Link>
						) : (
							<>
								<Button onClick={handleClose}>Cancel</Button>
								<Button onClick={handleDeleteSpace} color="error">
									Delete
								</Button>
							</>
						)}
					</DialogActions>
				</Dialog>
			</div>
			<Typography variant="h4" gutterBottom>
				<FiberManualRecordIcon style={{ color: "#00B884" }} />
				{space.name}
			</Typography>
			<Grid container spacing={4}>
				<Grid item xs={12} md={6}>
					<Paper
						sx={{
							p: 3,
							m: 2,
							backgroundColor: "whitesmoke",
							borderRadius: "15px",
						}}
					>
						<Typography variant="h6" gutterBottom component="div">
							Details
						</Typography>
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 1.5,
								alignItems: "center",
								mb: 2,
								p: 1,
								borderRadius: "4px",
								backgroundColor: "white",
							}}
						>
							<TagIcon sx={{ verticalAlign: "bottom" }} color="action" />
							<Typography variant="body1" component="span" sx={{ mr: 1 }}>
								Tags:
							</Typography>
							{space?.tags?.map((tag, index) => (
								<Chip
									key={index}
									label={tag.name}
									variant="outlined"
									sx={{ mr: 0.5, mb: 0.5 }}
									icon={
										<Avatar sx={{ width: 24, height: 24, bgcolor: tag.color }}>
											T
										</Avatar>
									}
								/>
							))}
						</Box>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								mb: 3,
								p: 1,
								borderRadius: "4px",
								backgroundColor: "white",
							}}
						>
							<GroupIcon sx={{ mr: 1 }} color="primary" />
							<Typography variant="body1">
								Group: {space?.group?.name}
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								p: 1,
								borderRadius: "4px",
								backgroundColor: "white",
							}}
						>
							<EventNoteIcon sx={{ mr: 1 }} color="secondary" />
							<Typography variant="body1">
								Created At: {new Date(space.created_at).toLocaleDateString()}
							</Typography>
						</Box>
					</Paper>
				</Grid>

				<Grid item xs={12} md={6}>
					<Typography variant="h6" gutterBottom>
						Description
					</Typography>
					<Typography variant="body2" sx={{ mt: 2 }}>
						{space.description}
					</Typography>
				</Grid>
			</Grid>
			<Paper sx={{ p: 2, m: 2, backgroundColor: "whitesmoke" }}>
				<Typography variant="h6" gutterBottom>
					Folders
				</Typography>
				<Grid container spacing={2}>
					{folders.map((folder) => (
						<Grid item xs={12} sm={6} md={4} key={folder.id}>
							{" "}
							{/* Adjust the sizes as needed */}
							<Card
								sx={{
									mb: 2,
									width: "80%",
									height: "100%",
									cursor: "pointer",
									display: "flex",
								}}
							>
								<CardContent
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
									onClick={() => folderDetailSetDialogOpen(folder.id)}
								>
									<Typography variant="body2">
										<FolderIcon sx={{ verticalAlign: "middle", mr: 1 }} />
										{folder.name}
									</Typography>
								</CardContent>
								<IconButton
									size="small"
									color="primary"
									onClick={() => handleSetDialogOpen(folder.id)}
								>
									<AddCircleOutlineIcon />
								</IconButton>
							</Card>
						</Grid>
					))}
				</Grid>
			</Paper>

			<Paper sx={{ p: 2, m: 2, backgroundColor: "whitesmoke" }}>
				<Typography variant="h6" gutterBottom>
					Projects
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} md={4}>
						{" "}
						{/* Adjust the sizes as needed */}
						<Card sx={{ mb: 2, width: "100%", height: "100%" }}>
							<CardContent
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Typography variant="body2">
									<FolderIcon sx={{ verticalAlign: "middle", mr: 1 }} />
									Project 1
								</Typography>
								<IconButton size="small" color="primary">
									<ApartmentIcon />
								</IconButton>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Paper>
			<Dialog
				style={{ padding: "30px" }}
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
			>
				<DialogTitle>Select Chats to Assign</DialogTitle>
				<List>
					{chats.map((chat) => (
						<ListItem
							key={chat.id}
							dense
							button
							onClick={() => handleSelectChat(chat.id)}
						>
							<Checkbox
								checked={selectedChats.has(chat.id)}
								edge="start"
								tabIndex={-1}
								disableRipple
							/>
							<ListItemText primary={chat.title} />
						</ListItem>
					))}
					<Button
						className="btn btn-primary"
						onClick={() => assignChatsToFolder(1)}
					>
						Assign
					</Button>
				</List>
			</Dialog>

			<Dialog
				style={{ padding: "30px" }}
				open={detailDialogOpen}
				onClose={() => setDetailDialogOpen(false)}
				fullWidth
				maxWidth="md" // Adjust size as needed
			>
				<DialogTitle>Here are all the chats</DialogTitle>
				<TableContainer component={Paper}>
					<Table aria-label="chats table">
						<TableHead style={{ backgroundColor: "whitesmoke" }}>
							<TableRow>
								<TableCell padding="checkbox"></TableCell>
								<TableCell>Title</TableCell>
								<TableCell>Response (truncated)</TableCell>
								<TableCell>Created At</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{folderChats.map((chat) => (
								<TableRow key={chat.id}>
									<TableCell padding="checkbox"></TableCell>
									<TableCell component="th" scope="row">
										{chat.title}
									</TableCell>
									<TableCell>
										{`${chat.response.substring(0, 50)}...`}{" "}
										{/* Adjust truncation as needed */}
									</TableCell>
									<TableCell>
										{new Date(chat.created_at).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Tooltip title="View Details">
											<IconButton>
												<Link href={`/chat/${chat.id}`} legacyBehavior>
													<VisibilityIcon />
												</Link>
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Dialog>
		</Container>
	);
};

export default Space;
