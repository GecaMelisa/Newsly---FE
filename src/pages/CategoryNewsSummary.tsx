import React, { useState, useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { fetchCategories, Category } from "../api/categoryApi.ts";
import { fetchNewsByCategoryId, News } from "../api/newsApi.ts";
import { toast } from "react-toastify";

const CategoryNewsSummary: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [categorySummary, setCategorySummary] = useState<{
    [key: string]: number;
  }>({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchCategorySummary = async (date: string) => {
    setLoading(true);
    try {
      const categoriesData = await fetchCategories();
      const summary: { [key: string]: number } = {};

      for (const category of categoriesData) {
        const newsData = await fetchNewsByCategoryId(category.id);
        const newsCount = newsData.filter((news) =>
          news.date.startsWith(date)
        ).length;
        summary[category.name] = newsCount;
      }

      setCategorySummary(summary);
    } catch (err) {
      toast.error("Failed to load category summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorySummary(selectedDate);
  }, [selectedDate]);

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        News Published by Category
      </Typography>
      <TextField
        label="Select Date"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={4}>
        {Object.entries(categorySummary).map(([category, count]) => (
          <Grid item xs={12} sm={6} md={4} key={category}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{category}</Typography>
                <Typography variant="h4" color="primary">
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryNewsSummary;
