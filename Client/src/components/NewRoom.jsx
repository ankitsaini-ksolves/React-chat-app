import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const NewRoom = ({ onRoomAdded }) => {
  const [roomName, setRoomName] = useState("");
  const user = useSelector((state) => state.auth.user);

  const handleAddRoom = async () => {
    if (roomName.trim() === "") {
      toast.error("Room name cannot be empty");
      return;
    }
    onRoomAdded({ name: roomName });
    setRoomName("");
  };
  return (
    <div className="new-room">
      <input
        type="text"
        placeholder="New Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="form-control"
      />
      <button className="btn btn-primary mt-2" onClick={handleAddRoom}>
        Add Room
      </button>
    </div>
  );
};

export default NewRoom;
