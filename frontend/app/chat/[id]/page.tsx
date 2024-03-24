"use client";
import { useEffect, useState } from "react";
import { apiClient } from "@/app/utils/api";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";

const ChatPage = ({ params }) => {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const fetchChatData = async () => {
        try {
          const response = await apiClient.get(`/chat/${params.id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + localStorage.getItem("token"),
            },
          });
          const data = await response.json();
          setChat(data.chat);
          setLoading(false);
        } catch (error) {
          console.error("Error:", error);
          setLoading(false);
        }
      };
      fetchChatData();
    }
  }, [params.id]);

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ maxWidth: 600, width: "100%", p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Chat Details
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Chat ID:
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              style={{
                padding: "10px",
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <Typography variant="body1" color="text.primary">
                {params.id}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Title:
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              style={{
                padding: "10px",
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <Typography variant="body1" color="text.primary">
                {chat?.title}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Prompt:
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              style={{
                padding: "10px",
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <Typography variant="body1" color="text.primary">
                {chat?.prompt}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Response:
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              style={{
                padding: "10px",
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <Typography variant="body1" color="text.primary">
                {chat?.response}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ChatPage;
