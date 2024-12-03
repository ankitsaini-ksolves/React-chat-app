import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, addMessage, setRoom } from '../redux/chatSlice';
import { io } from 'socket.io-client';
import '../App.css'

const socket = io('http://localhost:5000');

const ChatRoom = () => {
    const dispatch = useDispatch();
    const { messages, roomId } = useSelector((state) => state.chat);
    const [message, setMessage] = useState('');
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const defaultRoom = 'general';
        dispatch(setRoom(defaultRoom));
        socket.emit('joinRoom', defaultRoom);

        dispatch(fetchMessages(defaultRoom));

        socket.on('receiveMessage', (newMessage) => {
            dispatch(addMessage(newMessage));
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch]);

    const handleSendMessage = () => {
        const newMessage = {
            roomId,
            userId: user.id,
            username: user.username,
            message,
        };

        socket.emit('sendMessage', newMessage);
        setMessage('');
    };

    return (
        <div>
            <h1>Chat Room: {roomId}</h1>
            <div className="chat-box" style={{ height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.username}</strong>: {msg.message}
                    </div>
                ))}
            </div>
            <div className="input-group mt-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
