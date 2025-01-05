import axios from "axios";

// Set the base URL to your backend server
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default apiClient;
