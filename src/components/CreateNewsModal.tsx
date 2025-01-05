import React, { useState } from "react";
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
import { createNews, CreateNewsPayload } from "../api/newsApi.ts";
import { suggestCategory } from "../api/categoryApi.ts";
import { getUserIdFromToken } from "../utils/tokenUtils.ts";
import { toast } from "react-toastify";

interface CreateNewsModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateNewsModal: React.FC<CreateNewsModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState<string | undefined>(
    undefined
  );
  const [date, setDate] = useState("");
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      toast.success("News created successfully! 🎉");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to create news. Please try again.");
      console.error("Create news error:", error);
    },
  });

  const handleSuggestCategory = async () => {
    if (!content) {
      setError("Please write content to get a category suggestion.");
      return;
    }
    setSuggestionLoading(true);
    try {
      const suggestedCategory = await suggestCategory(content);
      setCategoryName(suggestedCategory);
    } catch {
      setError("Failed to fetch category suggestion. Please try again.");
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleSubmit = () => {
    const user_id = getUserIdFromToken(); // Ensure the token is correctly retrieved

    const rawDate = date.split("-");
    const newDate = rawDate[2] + "." + rawDate[1] + "." + rawDate[0] + ".";
    console.log(newDate);

    if (!user_id) {
      setError("User not authenticated. Please log in again.");
      console.error("User ID not found in token.");
      return;
    }

    if (!title || !content || !categoryName || !date) {
      setError("All fields are required.");
      return;
    }

    const payload: CreateNewsPayload = {
      title,
      content,
      date: newDate,
      category_name: categoryName,
      user_id,
    };

    console.log("Submitting payload:", payload);
    mutation.mutate(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create News</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            label="Category Name"
            fullWidth
            value={categoryName || ""}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button
            onClick={handleSuggestCategory}
            variant="outlined"
            color="primary"
            disabled={suggestionLoading}
            sx={{ ml: 2 }}
          >
            {suggestionLoading ? (
              <CircularProgress size={20} sx={{ color: "primary.main" }} />
            ) : (
              "Suggest Category"
            )}
          </Button>
        </Box>
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
          disabled={mutation.status === "pending"}
        >
          {mutation.status === "pending" ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Submit"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewsModal;
