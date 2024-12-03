import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { useSelector } from 'react-redux';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostPage from "./pages/PostPage";

const App = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    return (
        <Router>
      {isAuthenticated && <Navbar />}
            <div className="container mt-3">
                <Routes>
                  <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/chat-room" element={<ChatRoom />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
