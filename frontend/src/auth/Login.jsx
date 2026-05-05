import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authAPI } from "../services/api";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await authAPI.post("/auth/login", {
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
      } else if (decoded.role === "ADMIN") {
        navigate("/dashboard/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <input className="auth-input" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="auth-input" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="auth-btn" type="submit">Login</button>
          </form>
          Register Here <Link to="/register">Register</Link>
        </div>
      </div>
    </>
  );
}