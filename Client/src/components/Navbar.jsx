import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import userIcon from '../assets/149071.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Chat App</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat-room">Chat room</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/posts">Post</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {user && (
              <>
                <img
                  src={userIcon}
                  alt="User Icon"
                  className="rounded-circle"
                  width="40"
                  height="40"
                  style={{ marginRight: '10px' }}
                />
                <span className="text-light me-3">Welcome, {user.name}</span>
                <div>
                  <button
                    className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
