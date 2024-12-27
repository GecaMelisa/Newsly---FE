import React, { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress, Button, Box } from "@mui/material";
import CategoryContainer from "../components/CategoryContainer.tsx";
import { fetchCategories, Category } from "../api/categoryApi.ts";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Welcome to Newsly Dashboard
      </Typography>
      {isLoggedIn && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/create-news")}
          sx={{ mb: 3 }}
        >
          Create News
        </Button>
      )}
      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item xs={12} key={category.id}>
            <CategoryContainer
              categoryId={category.id}
              categoryName={category.name}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
