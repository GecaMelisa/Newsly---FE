import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CategoryContainer from "../components/CategoryContainer.tsx";
import { fetchCategories, Category } from "../api/categoryApi.ts";
import { fetchNewsByCategoryId, News, deleteNews } from "../api/newsApi.ts";
import { AuthContext } from "../context/AuthContext.tsx";
import CreateNewsModal from "../components/CreateNewsModal.tsx";
import EditNewsModal from "../components/EditNewsModal.tsx";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "">("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<
    "title" | "content" | "date" | "category_name"
  >("date");
  const { isLoggedIn } = useContext(AuthContext);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: deleteNews,
    onSuccess: () => {
      toast.success("News deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Error deleting news: ${error.message}`);
    },
  });

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        const allNewsData: News[] = [];
        for (const category of categoriesData) {
          const newsInCategory = await fetchNewsByCategoryId(category.id);
          allNewsData.push(...newsInCategory);
        }
        setAllNews(allNewsData);
      } catch (err) {
        toast.error("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  const handleNewsCreated = (newNews: News) => {
    setAllNews((prevNews) => [
      {
        ...newNews,
        date: new Date(newNews.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      },
      ...prevNews,
    ]);
  };

  const filteredNews = allNews
    .filter((news) =>
      searchTerm.trim()
        ? news.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          news.content.toLowerCase().includes(searchTerm.toLowerCase().trim())
        : true
    )
    .filter((news) =>
      selectedCategory ? news.category_name === selectedCategory : true
    )
    .filter((news) => (selectedDate ? news.date.includes(selectedDate) : true))
    .sort((a, b) => {
      if (sortField === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc"
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });

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
      <ToastContainer position="top-right" autoClose={3000} />

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

      <CreateNewsModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        onNewsCreated={handleNewsCreated}
      />

      <Grid container spacing={4}>
        {categories.map((category) => {
          const categoryFilteredNews = filteredNews.filter(
            (news) => news.category_name === category.name
          );
          if (categoryFilteredNews.length === 0) return null;

          return (
            <Grid item xs={12} key={category.id}>
              <CategoryContainer
                categoryId={category.id}
                categoryName={category.name}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                news={categoryFilteredNews}
              />
            </Grid>
          );
        })}
      </Grid>

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
