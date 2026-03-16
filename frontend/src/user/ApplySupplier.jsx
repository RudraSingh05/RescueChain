import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { authAPI } from "../services/api";

export default function ApplySupplier() {
  const [form, setForm] = useState({
    organizationName: "",
    type: "",
    latitude: "",
    longitude: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await authAPI.post("/supplier/apply", form);
      alert("Supplier application submitted");
      setForm({
        organizationName: "",
        type: "",
        latitude: "",
        longitude: ""
      });
    } catch (error) {
      alert(error.response?.data?.error || "Application failed");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Apply to Become Supplier</h1>
      <form onSubmit={handleSubmit} className="form-card">
        <input className="form-input" name="organizationName" placeholder="Organization Name" value={form.organizationName} onChange={handleChange} required />
        <input className="form-input" name="type" placeholder="Type (Hospital / NGO / Pharmacy)" value={form.type} onChange={handleChange} required />
        <input className="form-input" name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} required />
        <input className="form-input" name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} required />
        <button className="form-btn" type="submit">Apply</button>
      </form>
    </DashboardLayout>
  );
}