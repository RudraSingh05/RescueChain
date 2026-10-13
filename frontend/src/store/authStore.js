import { create } from "zustand";
const initial = () => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  userId: localStorage.getItem("userId"),
});
const useAuthStore = create((set) => ({
  ...initial(),
  login: (token, role, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", String(userId));
    set({ token, role, userId });
  },
  logout: () => {
    ["token", "role", "userId"].forEach((k) => localStorage.removeItem(k));
    set({ token: null, role: null, userId: null });
  },
}));
export default useAuthStore;
