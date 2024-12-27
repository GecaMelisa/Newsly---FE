import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { News } from "../api/newsApi.ts";

interface NewsCardProps {
  news: News;
  onClick: () => void; // Pass a click handler to trigger the modal
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  return (
    <Card
      sx={{
        "&:hover": {
          boxShadow: 6,
          cursor: "pointer",
        },
        transition: "box-shadow 0.3s ease",
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Chip label="News" color="primary" />
          <Typography variant="caption">{news.date}</Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {news.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {news.content.slice(0, 100)}...
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
