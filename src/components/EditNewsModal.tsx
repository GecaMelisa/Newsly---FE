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
import { getUserIdFromToken } from "../utils/tokenUtils.ts";

interface EditNewsModalProps {
  open: boolean;
  onClose: () => void;
  news: UpdateNewsPayload | null;
}

// Helper functions for date formatting
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split(".");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
  const [title, setTitle] = useState(news?.title || "");
  const [content, setContent] = useState(news?.content || "");
  const [categoryName, setCategoryName] = useState(news?.category_name || "");
  const [date, setDate] = useState(
    news?.date ? formatDateForInput(news.date) : ""
  );
  const [newsId, setNewsId] = useState<number | null>(news?.id || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (news && news.id) {
      setTitle(news.title);
      setContent(news.content);
      setCategoryName(news.category_name);
      setDate(formatDateForInput(news.date));
      setNewsId(news.id);
    } else {
      setError("Invalid news data. News ID is missing.");
    }
  }, [news]);

  const mutation = useMutation({
    mutationFn: updateNews,
    onSuccess: () => {
      window.location.reload();
      onClose();
    },
    onError: (err: any) => {
      console.error("Update error:", err);
      setError("Failed to update news. Please try again.");
    },
  });

  const handleSubmit = () => {
    const user_id = getUserIdFromToken();
    if (!title || !content || !categoryName || !date) {
      setError("All fields are required.");
      return;
    }

    if (!newsId) {
      setError("Invalid news data. News ID is missing.");
      return;
    }

    const payload: UpdateNewsPayload = {
      id: newsId,
      title,
      content,
      category_name: categoryName,
      date: formatDateForOutput(date),
      user_id: user_id ?? undefined,
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
