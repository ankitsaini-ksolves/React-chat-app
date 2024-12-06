import React from "react";
import { shallowEqual, useSelector } from "react-redux";

const ChatBody = () => {
  const currentRoom = useSelector((state) => state.chat.currentRoom);
  const messages = useSelector((state) => state.chat.messages[currentRoom] || [], shallowEqual);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="message_container">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} className="message_chats">
            {msg.user_id === user.id ? (
              <>
                <p className="mt-3 mb-0 sender_name">You</p>
                <div className="sender_msg">{msg.message}</div>
              </>
            ) : (
              <>
                <p className="mb-0 mt-3 message_chats">{msg.username}</p>
                <div className="recipient_msg">{msg.message}</div>
              </>
            )}
          </div>
        ))
      ) : (
        <div className="no-messages text-center mt-4">
          <p className="text-muted">
            No chats in this room yet. Start the conversation!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatBody;
