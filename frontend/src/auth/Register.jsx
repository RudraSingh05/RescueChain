import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { authAPI, errorMessage } from "../services/api";
import { Notice } from "../components/UI";
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authAPI.post("/auth/register", form);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  }
  const change = (e) =>
    setForm((v) => ({ ...v, [e.target.name]: e.target.value }));
  return (
    <main className="auth-layout">
      <div className="auth-story">
        <Link to="/login" className="auth-brand">
          <ShieldCheck size={23} /> rescuechain
        </Link>
        <div className="auth-story-content">
          <span className="hero-kicker">JOIN THE NETWORK</span>
          <h1>Stronger response. Together.</h1>
          <p>
            One shared network for timely access to essential supplies and
            responsible coordination.
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
          <p className="eyebrow">GET STARTED</p>
          <h2>Create your account</h2>
          <p className="auth-intro">
            Join the emergency supply coordination network.
          </p>
          <Notice>{error}</Notice>
          <form onSubmit={submit} className="form-stack">
            <label className="field">
              <span>Full name</span>
              <span className="input-wrap">
                <UserRound size={17} />
                <input
                  name="name"
                  autoComplete="name"
                  required
                  value={form.name}
                  placeholder="Your full name"
                  onChange={change}
                />
              </span>
            </label>
            <label className="field">
              <span>Email address</span>
              <span className="input-wrap">
                <Mail size={17} />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  placeholder="you@organization.com"
                  onChange={change}
                />
              </span>
            </label>
            <label className="field">
              <span>Password</span>
              <span className="input-wrap">
                <LockKeyhole size={17} />
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={form.password}
                  placeholder="Create a secure password"
                  onChange={change}
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
              className="btn btn-primary btn-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
        <div className="auth-side-footer">SECURE ACCESS · RESCUECHAIN</div>
      </div>
    </main>
  );
}
