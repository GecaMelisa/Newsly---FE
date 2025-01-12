import React, { useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import NewsCard from "./NewsCard.tsx";
import NewsDetailsModal from "./NewsDetailsModal.tsx";
import { News } from "../api/newsApi.ts";

interface CategoryContainerProps {
  categoryId: number;
  categoryName: string;
  onEdit: (news: News) => void;
  onDelete: (newsId: number) => void;
  news: News[]; // ✅ Added news prop to receive data from Dashboard
}

const CategoryContainer: React.FC<CategoryContainerProps> = ({
  categoryId,
  categoryName,
  onEdit,
  onDelete,
  news, // ✅ Using the filtered news passed from Dashboard
}) => {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleNewsClick = (news: News) => {
    setSelectedNews(news);
    setModalOpen(true);
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {categoryName}
        </Typography>

        {/* ✅ Display filtered news directly */}
        <Grid container spacing={3}>
          {news.length > 0 ? (
            news.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <NewsCard
                  news={item}
                  onClick={() => handleNewsClick(item)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </Grid>
            ))
          ) : (
            <Typography>No news available for this category.</Typography>
          )}
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
