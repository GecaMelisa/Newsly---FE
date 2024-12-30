import apiClient from "./axiosConfig.ts";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (data: LoginPayload): Promise<string> => {
  const response = await apiClient.post("/api/auth/login", data);
  return response.data;
};

export const registerUser = async (data: RegisterPayload): Promise<string> => {
  const response = await apiClient.post("/api/auth/register", data);
  return response.data;
};
