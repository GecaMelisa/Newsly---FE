import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { updateNews, UpdateNewsPayload } from "../api/newsApi.ts";

interface EditNewsModalProps {
  open: boolean;
  onClose: () => void;
  news: UpdateNewsPayload | null; // Allow null to handle initial state
}

// Helper functions for date formatting
const formatDateForInput = (dateString: string): string => {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
};

const formatDateForOutput = (inputDate: string): string => {
  const [year, month, day] = inputDate.split("-");
  return `${day}.${month}.${year}.`;
};

const EditNewsModal: React.FC<EditNewsModalProps> = ({
  open,
  onClose,
  news,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [date, setDate] = useState(""); // Ensure correct date format
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setContent(news.content);
      setCategoryName(news.category_name);
      setDate(formatDateForInput(news.date)); // Convert to `yyyy-MM-dd` for input
    }
  }, [news]);

  const mutation = useMutation({
    mutationFn: updateNews,
    onSuccess: () => {
      onClose(); // Close modal on success
    },
    onError: (err: any) => {
      console.error("Update error:", err);
      setError("Failed to update news. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!title || !content || !categoryName || !date) {
      setError("All fields are required.");
      return;
    }

    if (!news || !news.id) {
      setError("Invalid news data.");
      return;
    }

    const payload: UpdateNewsPayload = {
      id: news.id, // Ensure correct ID is used
      title,
      content,
      category_name: categoryName,
      date: formatDateForOutput(date), // Convert back to `dd.MM.yyyy.`
    };

    console.log("Submitting update payload:", payload);
    mutation.mutate(payload);
  };

  const isLoading = mutation.status === "pending";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit News</DialogTitle>
      <DialogContent>
        {error && (
          <Box sx={{ mb: 2, color: "error.main", textAlign: "center" }}>
            {error}
          </Box>
        )}
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Content"
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Category Name"
          fullWidth
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Update"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNewsModal;
