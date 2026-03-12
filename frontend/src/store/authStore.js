import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  userId: localStorage.getItem("userId") || null,

  login: (token, role, userId) => {

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);

    set({ token, role, userId });
  },

  logout: () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    set({
      token: null,
      role: null,
      userId: null
    });
  }
}));

export default useAuthStore;