import { useState } from "react";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.post("/auth/register", form);
      alert("User registered successfully");
      console.log(res.data);
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input className="auth-input" type="text" name="name" placeholder="Full Name" onChange={handleChange} />
          <input className="auth-input" type="email" name="email" placeholder="Email" onChange={handleChange} />
          <input className="auth-input" type="password" name="password" placeholder="Password" onChange={handleChange} />
          <button className="auth-btn" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}