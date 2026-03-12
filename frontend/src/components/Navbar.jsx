import useAuthStore from "../store/authStore";

export default function Navbar() {

  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);

  return (
    <div className="navbar">

      <h2>Emergency Supply Chain</h2>

      <div className="nav-right">
        <span>{role}</span>
        <button onClick={logout}>Logout</button>
      </div>

    </div>
  );
}