import axios from "axios";
import { News } from "./newsApi.ts";
import apiClient from "./axiosConfig.ts";

// Interface for categories
export interface Category {
  news: any;
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/api/categories");
  return response.data;
};

// Fetch news by category ID
export const fetchNewsByCategoryId = async (
  categoryId: number
): Promise<News[]> => {
  const response = await axios.get(`/api/news/category/${categoryId}`);
  return response.data;
};

export const suggestCategory = async (content: string): Promise<string> => {
  const response = await apiClient.post("/api/categories/generate", {
    content,
  });
  return response.data; // Backend should return the suggested category name
};
