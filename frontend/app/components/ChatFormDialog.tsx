"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export const ChatFormDialog = ({ open, onClose, onSave }) => {
  const [chatTitle, setChatTitle] = useState("");
  const [chatPrompt, setChatPrompt] = useState("");

  const handleSave = () => {
    onSave({ title: chatTitle, prompt: chatPrompt });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Chat</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Chat Title"
          fullWidth
          variant="outlined"
          value={chatTitle}
          onChange={(e) => setChatTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Chat Prompt"
          fullWidth
          variant="outlined"
          value={chatPrompt}
          onChange={(e) => setChatPrompt(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};
