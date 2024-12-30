import React, { useEffect, useState, useContext } from "react";
import { Grid, Typography, CircularProgress, Button, Box } from "@mui/material";
import CategoryContainer from "../components/CategoryContainer.tsx";
import { fetchCategories, Category } from "../api/categoryApi.ts";
import { AuthContext } from "../context/AuthContext.tsx";
import CreateNewsModal from "../components/CreateNewsModal.tsx";
import EditNewsModal from "../components/EditNewsModal.tsx";
import { News, deleteNews } from "../api/newsApi.ts";
import { useMutation } from "@tanstack/react-query";

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useContext(AuthContext);

  // Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  // Mutation for deleting news
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: deleteNews,
    onSuccess: () => {
      console.log("News deleted successfully");
      // Optionally refresh categories or invalidate queries here
    },
    onError: (error) => {
      console.error("Error deleting news:", error);
    },
  });

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);

  const handleOpenEditModal = (news: News) => {
    setEditingNews(news);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingNews(null);
    setEditModalOpen(false);
  };

  const handleDelete = (newsId: number) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      deleteMutation.mutate(newsId);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome to Newsly Dashboard
        </Typography>
        {isLoggedIn && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenCreateModal}
          >
            Create News
          </Button>
        )}
      </Box>
      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item xs={12} key={category.id}>
            <CategoryContainer
              categoryId={category.id}
              categoryName={category.name}
              onEdit={handleOpenEditModal} // Pass edit handler
              onDelete={handleDelete} // Pass delete handler
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal for creating news */}
      <CreateNewsModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
      />

      {/* Modal for editing news */}
      {editingNews && (
        <EditNewsModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          news={editingNews}
        />
      )}
    </Box>
  );
};

export default Dashboard;
