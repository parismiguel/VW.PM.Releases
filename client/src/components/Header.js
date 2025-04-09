import React, { useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import "./Header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate("/login"); // Redirect to login page
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    logout(navigate);
  };

  const isLoginPage = location.pathname === "/login";

  return (
    <header className='header'>
      <h1>
        <Link to='/' className='home-link'>
          VW.PM.Releases
        </Link>
      </h1>
      <div className='user-info'>
        {!isLoginPage &&
          (user ? (
            <div className='user-logged-in'>
              <span>{user.username}</span>
              <Button
                variant='outlined'
                color='error'
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: "20px", // Rounded corners
                  textTransform: "none", // Prevent uppercase text
                  fontWeight: "bold", // Bold text
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant='outlined'
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{
                borderRadius: "20px", // Rounded corners
                textTransform: "none", // Prevent uppercase text
                fontWeight: "bold", // Bold text
              }}
            >
              Login
            </Button>
          ))}
      </div>
    </header>
  );
}

export default Header;
