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
  news: News | null; // Pass the selected news item
}

const NewsDetailsModal: React.FC<NewsDetailsModalProps> = ({
  open,
  onClose,
  news,
}) => {
  if (!news) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{news.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Date: {news.date}
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
