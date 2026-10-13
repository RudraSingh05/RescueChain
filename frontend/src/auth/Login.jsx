import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { authAPI, errorMessage } from "../services/api";
import useAuthStore from "../store/authStore";
import { Notice } from "../components/UI";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authAPI.post("/auth/login", { email, password });
      const decoded = jwtDecode(data.token);
      login(data.token, decoded.role, decoded.userId);
      navigate(
        decoded.role === "ADMIN"
          ? "/dashboard/admin"
          : decoded.role === "SUPPLIER"
            ? "/dashboard/supplier"
            : "/dashboard/user",
        { replace: true },
      );
    } catch (err) {
      setError(errorMessage(err, "Unable to sign in"));
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="auth-layout">
      <div className="auth-story">
        <Link to="/login" className="auth-brand">
          <ShieldCheck size={23} /> rescuechain
        </Link>
        <div className="auth-story-content">
          <span className="hero-kicker">EMERGENCY SUPPLY NETWORK</span>
          <h1>Care begins with connection.</h1>
          <p>
            A considered way to discover, reserve, and coordinate essential
            supplies when every moment matters.
          </p>
        </div>
        <div className="auth-story-footer">
          CONNECTED COMMUNITIES. BETTER RESPONSE.
        </div>
      </div>
      <div className="auth-side">
        <div className="auth-box">
          <div className="auth-mobile-brand">
            <ShieldCheck size={22} /> rescuechain
          </div>
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to your workspace</h2>
          <p className="auth-intro">
            Enter your credentials to continue to RescueChain.
          </p>
          <Notice>{error}</Notice>
          <form onSubmit={submit} className="form-stack">
            <label className="field">
              <span>Email address</span>
              <span className="input-wrap">
                <Mail size={17} />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </span>
            </label>
            <label className="field">
              <span>Password</span>
              <span className="input-wrap">
                <LockKeyhole size={17} />
                <input
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="input-icon-btn"
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((v) => !v)}
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>
            <button
              disabled={loading}
              className="btn btn-primary btn-full"
              type="submit"
            >
              {loading ? "Signing in…" : "Sign in"}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="auth-switch">
            New to RescueChain? <Link to="/register">Create an account</Link>
          </p>
        </div>
        <div className="auth-side-footer">SECURE ACCESS · RESCUECHAIN</div>
      </div>
    </main>
  );
}
