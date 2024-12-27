import axios from "axios";
import apiClient from "./axiosConfig.ts";

// Interface for news
export interface News {
  id: number;
  title: string;
  content: string;
  date: string;
  categoryId: number;
  userId: number;
}

export interface CreateNewsPayload {
  title: string;
  content: string;
  categoryId: number;
  date: string;
}

export const fetchNewsByCategoryId = async (categoryId: number) => {
  const response = await apiClient.get(`/api/news/category/${categoryId}`);
  return response.data;
};

export const createNews = async (data: CreateNewsPayload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post("/api/news", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteNews = async (id: number): Promise<void> => {
  const token = localStorage.getItem("token");
  await axios.delete(`/api/news/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
