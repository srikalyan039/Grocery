import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useSearchStore from "../store/useSearchStore";

const Navbar = () => {
  const { isLoggedIn, user, logout, initializeAuth, cartCount } =
    useAuthStore();
  const { search, setSearch } = useSearchStore();

  useEffect(() => {
    if (typeof initializeAuth === "function") {
      initializeAuth();
    }
  }, []);

  // Safely extract name or email from user state
  const displayName =
    typeof user === "object" && user !== null
      ? user.name || user.email || "Customer"
      : user || "Customer";

  return (
    <div className="navSection">
      {/* Logo / Title */}
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="title">Grocery</div>
      </Link>

      {/* Global Search */}
      <div className="search">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cart Link */}
      <Link to="/cart" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="cart">
          Cart{" "}
          <span className="text-orange-600 text-2xl font-bold">
            {cartCount || 0}
          </span>
        </div>
      </Link>

      {/* User Greeting */}
      <div className="userName">
        {isLoggedIn && (
          <div>
            Welcome{" "}
            <span className="userHighlight">{displayName}</span>
          </div>
        )}
      </div>

      {/* Auth Controls */}
      <div className="auth">
        {isLoggedIn ? (
          <button className="logoutBtn" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link to="/send-otp" className="loginBtn">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;