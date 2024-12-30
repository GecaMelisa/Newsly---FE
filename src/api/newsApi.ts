import apiClient from "./axiosConfig.ts";

export interface News {
  id: number;
  title: string;
  content: string;
  date: string;
  category_name: string;
  email: string | null;
  user_id: number;
  user_name: string;
}

// Interface for creating news
export interface CreateNewsPayload {
  title: string;
  content: string;
  date: string;
  category_name: string;
  user_id: number;
}

// Interface for updating news
export interface UpdateNewsPayload {
  id: number; // Use `id` to match the backend
  title: string;
  content: string;
  date: string;
  category_name: string;
}

// Fetch news by category ID
export const fetchNewsByCategoryId = async (
  categoryId: number
): Promise<News[]> => {
  const response = await apiClient.get(`/api/news/category/${categoryId}`);
  return response.data;
};

// Fetch all authors
export const fetchAuthors = async (): Promise<string[]> => {
  const response = await apiClient.get("/api/news/authors");
  return response.data;
};

// Fetch news by author
export const fetchNewsByAuthor = async (email: string): Promise<News[]> => {
  const response = await apiClient.get(`/api/news/user/${email}`);
  return response.data;
};

// Create a news item
export const createNews = async (data: CreateNewsPayload): Promise<News> => {
  const token = localStorage.getItem("token");
  const response = await apiClient.post("/api/news", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a news item
export const updateNews = async (data: UpdateNewsPayload): Promise<News> => {
  const token = localStorage.getItem("token");
  const response = await apiClient.put(`/api/news/${data.id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a news item
export const deleteNews = async (id: number): Promise<void> => {
  const token = localStorage.getItem("token");
  await apiClient.delete(`/api/news/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
