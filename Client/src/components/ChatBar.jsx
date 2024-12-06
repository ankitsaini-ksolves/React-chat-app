import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRoom, fetchMessages, deleteRoom, addRoom } from "../redux/chatSlice";
import NewRoom from "./NewRoom";
import { toast } from "react-toastify";

const ChatBar = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.chat.rooms);
  const currentRoom = useSelector((state) => state.chat.currentRoom);
  const user = useSelector((state) => state.auth.user);

  const handleRoomClick = (roomId) => {
    if (roomId !== currentRoom) {
      dispatch(setRoom(roomId));
      dispatch(fetchMessages(roomId));
    }
  };

  const handleRoomDelete = async (roomId) => {
    try {
      dispatch(deleteRoom(roomId));
      toast.success("Room deleted successfully!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to Delete", { autoClose: 2000 });
    }
  };

  const handleRoomAdded = async (newRoom) => {
    try {
      const roomData = { ...newRoom, created_by: user.id };
      dispatch(addRoom(roomData));
      toast.success("Room added successfully!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to add room", { autoClose: 2000 });
    }
  };

  return (
    <div className="chat_bar">
      <h4>Chat Rooms</h4>
      <NewRoom onRoomAdded={handleRoomAdded} />
      <div className="mt-3 rooms">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room.id}
              className="d-flex align-items-center justify-content-between"
            >
              <p
                onClick={() => handleRoomClick(room.id)}
                className={`mb-0 ${
                  currentRoom === room.id ? "active-room" : ""
                }`}
                style={{
                  cursor: "pointer",
                  color: currentRoom === room.id ? "blue" : "black",
                }}
              >
                {room.name}
              </p>
              <span className="pt-0 mt-0">
                {room.created_by === user.id && (
                  <i
                    onClick={() => handleRoomDelete(room.id)}
                    className="mdi mdi-delete mdi-24px mdi-dark"
                  ></i>
                )}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center mt-4">
            <p className="text-danger">No rooms yet. Create one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBar;
