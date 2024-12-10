import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessages, fetchRooms, setRoom } from "../redux/chatSlice";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const rooms = useSelector((state) => state.chat.rooms);

  useEffect(() => {
    if (rooms.length === 0) {
      dispatch(fetchRooms());
    }
  }, [dispatch, rooms.length]);

  const userRooms = rooms.filter((room) => room.created_by === user.id);

  const viewChats = (roomId) => {
    dispatch(setRoom(roomId));
    dispatch(fetchMessages(roomId));
    navigate("/chat-room");
  };

  return (
    <div>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">
            Welcome, <span className="text-primary">{user ? user.name : "Guest"}</span>!
          </h1>
          <p className="lead text-muted">
            Here are your chat rooms. Start a conversation or create new chat
            spaces to connect with others!
          </p>
        </div>
        <br></br>
        <div className="p-4 rounded" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="row g-3">
            {userRooms.length > 0 ? (
              userRooms.map((room) => (
                <div className="col-6 col-md-4 col-lg-3" key={room.id}>
                  <div
                    className="card shadow-sm border-0 text-center d-flex justify-content-center align-items-center"
                    style={{ height: "150px" }}
                  >
                    <h5 className="card-title text-primary">{room.name}</h5>
                    <button
                      className=" rounded-4 btn btn-secondary btn-sm mt-3"
                      onClick={() => viewChats(room.id)}
                    >
                      Open Chats! 
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-4">
                <p className="text-danger">
                  You haven't created any rooms yet.
                </p>
                <Link
                  className="btn btn-primary btn-sm rounded-5 ms-3"
                  to="/chat-room"
                >
                  Create one!
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;