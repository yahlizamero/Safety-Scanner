import axios from "axios";

// Public (client-safe) env var.
// Prefer: VITE_API_BASE_URL=http://localhost:5000 (or your deployed backend URL)
const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Create an instance of Axios with default configurations
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
