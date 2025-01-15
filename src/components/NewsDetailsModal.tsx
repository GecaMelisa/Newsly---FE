import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { News } from "../api/newsApi.ts";

interface NewsDetailsModalProps {
  open: boolean;
  onClose: () => void;
  news: News | null;
}

const NewsDetailsModal: React.FC<NewsDetailsModalProps> = ({
  open,
  onClose,
  news,
}) => {
  if (!news) return null;

  // Remove seconds and format the date properly
  const formattedDate = new Date(news.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{news.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Date: {formattedDate}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {news.content}
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewsDetailsModal;
