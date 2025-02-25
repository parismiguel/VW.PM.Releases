import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import "./Header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);
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
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className='user-not-logged-in'>
            <a href='/login'>Login</a>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
