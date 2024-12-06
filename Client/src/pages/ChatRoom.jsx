import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRoom, fetchMessages, fetchRooms } from "../redux/chatSlice";
import ChatFooter from "../components/ChatFooter";
import ChatBody from "../components/ChatBody";
import ChatBar from "../components/ChatBar";
import "../App.css";

const ChatRoom = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.chat.rooms);
  const currentRoom = useSelector((state) => state.chat.currentRoom);

  useEffect(() => {
    if (rooms.length === 0) {
      dispatch(fetchRooms());
    } else if (rooms.length > 0 && !currentRoom) {
      const defaultRoom = rooms[0].id;
      dispatch(setRoom(defaultRoom));
      dispatch(fetchMessages(defaultRoom));
    }
  }, [dispatch, rooms, currentRoom]);

  return (
    <div className="chat">
      <ChatBar />
      <div className="chat_main">
        <ChatBody />
        <ChatFooter />
      </div>
    </div>
  );
};

export default ChatRoom;
