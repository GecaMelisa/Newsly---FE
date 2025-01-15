import React, { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Stack,
} from "@mui/material";
import { News } from "../api/newsApi.ts";
import { getUserEmailFromToken } from "../utils/tokenUtils.ts";
import { AuthContext } from "../context/AuthContext.tsx";

interface NewsCardProps {
  news: News;
  onClick: () => void;
  onEdit: (news: News) => void;
  onDelete: (newsId: number) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  news,
  onClick,
  onEdit,
  onDelete,
}) => {
  const { isLoggedIn } = useContext(AuthContext);
  const userEmail = isLoggedIn ? getUserEmailFromToken() : null;

  // Format date to remove seconds
  const formattedDate = new Date(news.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

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
          <Chip label={news.category_name || "News"} color="primary" />
          <Typography variant="caption">{formattedDate}</Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {news.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {news.content.slice(0, 100)}...
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic", mb: 2 }}>
          Published by: <strong>{news.user_name}</strong>
        </Typography>

        {isLoggedIn && news.email === userEmail && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(news);
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(news.id);
              }}
            >
              Delete
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsCard;
