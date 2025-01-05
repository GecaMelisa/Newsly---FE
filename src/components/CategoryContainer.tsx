import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import NewsCard from "./NewsCard.tsx";
import NewsDetailsModal from "./NewsDetailsModal.tsx";
import { fetchNewsByCategoryId, News } from "../api/newsApi.ts";

interface CategoryContainerProps {
  categoryId: number;
  categoryName: string;
  onEdit: (news: News) => void;
  onDelete: (newsId: number) => void;
}

const CategoryContainer: React.FC<CategoryContainerProps> = ({
  categoryId,
  categoryName,
  onEdit,
  onDelete,
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await fetchNewsByCategoryId(categoryId);
        console.log(newsData);
        setNews(newsData);
      } catch (err) {
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [categoryId]);

  const handleNewsClick = (news: News) => {
    setSelectedNews(news);
    setModalOpen(true);
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mb: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {categoryName}
        </Typography>
        <Grid container spacing={3}>
          {news.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <NewsCard
                news={item}
                onClick={() => handleNewsClick(item)}
                onEdit={onEdit} // Pass edit handler
                onDelete={onDelete} // Pass delete handler
              />
            </Grid>
          ))}
        </Grid>
        <NewsDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          news={selectedNews}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryContainer;
