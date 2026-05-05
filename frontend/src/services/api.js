import axios from "axios";

export const authAPI = axios.create({
  baseURL: "http://localhost:5000"
});

export const inventoryAPI = axios.create({
  baseURL: "http://localhost:4000/inventory"
});

authAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

inventoryAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});