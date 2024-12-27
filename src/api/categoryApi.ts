import axios from "axios";
import { News } from "./newsApi.ts";
import apiClient from "./axiosConfig.ts";

// Interface for categories
export interface Category {
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
