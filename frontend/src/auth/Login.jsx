import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import "../styles/auth.css";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await authAPI.post("/login", {
        email,
        password
      });

      const token = res.data.token;

      const decoded = jwtDecode(token);

      login(token, decoded.role, decoded.userId);

      if (decoded.role === "USER") {
        navigate("/dashboard/user");
      } else if (decoded.role === "SUPPLIER") {
        navigate("/dashboard/supplier");
      } else {
        navigate("/");
      }

    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>

      </form>
    </>
  );
}