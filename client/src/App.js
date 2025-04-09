import React from "react";
import { AuthProvider } from "./AuthContext";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import ReleaseDetails from "./components/ReleaseDetails";
import CreateRelease from "./components/CreateRelease";
import EditRelease from "./components/EditRelease";
import Header from "./components/Header";
import Error from "./components/Error";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path="/error" element={<Error />} />
          
          <Route
            path='/releases/:id'
            element={
              <PrivateRoute>
                <ReleaseDetails />
              </PrivateRoute>
            }
          />
          <Route
            path='/create'
            element={
              <PrivateRoute>
                <CreateRelease />
              </PrivateRoute>
            }
          />
          <Route
            path='/edit/:id'
            element={
              <PrivateRoute>
                <EditRelease />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;