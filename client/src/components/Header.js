import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import {
  Button,
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import "./Header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.removeItem("auth"); // Clear authentication token
  //   navigate("/login"); // Redirect to login page
  // };

  const handleLogin = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className='header'>
      <h1>VW.PM.Releases</h1>
      <div className='user-info'>
        {user ? (
          <div className='user-logged-in'>
            <img
              src={user.avatarUrl}
              alt={`${user.username}'s avatar`}
              className='avatar'
            />
            <span>{user.username}</span>
            <Button
            variant='outlined'
            color='error'
            startIcon={<LogoutIcon />}
            onClick={logout}
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
        )}
      </div>
    </header>
  );
}

export default Header;
