import React from 'react';
import { useSelector } from 'react-redux';

const ChatBody = () => {
    const { messages } = useSelector((state) => state.chat);
    const user = useSelector((state) => state.auth.user);
    console.log(user,messages)

    return (
        <div className="message_container">
            {messages.map((msg, index) => (
                <div key={index} className="message_chats">
                    {msg.user_id === user.id ? (
                        <>
                            <p className="sender_name">You</p>
                            <div className="sender_msg">
                                {msg.message}
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="message_chats">{msg.username}</p>
                            <div className="recipient_msg">
                                {msg.message}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatBody;
