// frontend/src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true, // Wichtig für Cookies
});

export default api;
