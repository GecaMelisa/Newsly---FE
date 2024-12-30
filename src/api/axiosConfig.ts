import axios from "axios";

// Set the base URL to your backend server
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

export default apiClient;
