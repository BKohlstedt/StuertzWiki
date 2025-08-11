import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true, // Cookie wird automatisch mitgesendet
});

export default api;
