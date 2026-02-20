import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("email") || "User";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  // Helper to highlight active link
  const isActive = (path) =>
    location.pathname === path ? "bg-blue-300 text-blue-900" : "hover:bg-blue-200";

  return (
    <nav className="bg-blue-100 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        
        {/* Left side links */}
        <div className="flex space-x-4 items-center font-medium">
          {token ? (
            <>
              <Link
                to="/"
                className={`px-3 py-2 rounded-md transition ${isActive("/")}`}
              >
                Uasin Gishu County Traders Forum
                
              </Link>
              <Link
                to="/employees"
                className={`px-3 py-2 rounded-md transition ${isActive("/employees")}`}
              >
                Professionals List
              </Link>
            </>
          ) : (
            <h1 className="font-bold text-xl text-blue-900 tracking-wide">
              Logo
            </h1>
          )}
        </div>

        {/* Right side links */}
        <div className="flex space-x-4 items-center">
          {token ? (
            <>
              <span className="font-medium text-blue-900 hidden md:flex">{userName}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-md font-medium text-blue-900 hover:bg-blue-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium shadow-sm transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
