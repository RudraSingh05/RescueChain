import axios from "axios";
import useAuthStore from "../store/authStore";
// Match these to your existing backend URLs; Vite env values are embedded at build time.
export const authAPI = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URL || "http://localhost:5000",
});
export const inventoryAPI = axios.create({
    baseURL: import.meta.env.VITE_INVENTORY_API_URL || "http://localhost:4000/inventory",
});
for (const api of [authAPI, inventoryAPI]) {
    api.interceptors.request.use((config) => {
        const token = useAuthStore.getState().token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                useAuthStore.getState().logout();
                if (window.location.pathname !== "/login")
                    window.location.assign("/login");
            }
            return Promise.reject(error);
        },
    );
}
export const errorMessage = (error, fallback = "Something went wrong") =>
    error?.response?.data?.error || error?.response?.data?.message || fallback;
