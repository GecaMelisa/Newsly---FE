import apiClient from "./axiosConfig.ts";

// Interface for User
export interface User {
  id: number;
  name: string;
  email: string;
}

// Fetch all users
export const fetchAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get("/api/users");
  return response.data;
};

// Fetch user by email
export const findUserByEmail = async (email: string): Promise<User> => {
  const response = await apiClient.get(`/api/users/email/${email}`);
  return response.data;
};
