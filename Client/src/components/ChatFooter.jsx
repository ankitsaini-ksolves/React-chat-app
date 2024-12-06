import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchMessages, sendMessage } from "../redux/chatSlice";
import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const socket = io(API_BASE_URL);

const ChatFooter = () => {
  const dispatch = useDispatch();
  const roomId = useSelector((state) => state.chat.currentRoom);
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", roomId);
      dispatch(fetchMessages(roomId));

      socket.on("receiveMessage", (newMessage) => {
        dispatch(addMessage(newMessage));
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [roomId, dispatch]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      roomId,
      user_id: user.id,
      username:user.name,
      message,
    };

        dispatch(sendMessage(newMessage));


    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  return (
    <div className="input-group chat_footer">
      <input
        type="text"
        className="form-control"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="btn btn-success sendBtn" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatFooter;
