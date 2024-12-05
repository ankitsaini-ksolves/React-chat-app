import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage, setRoom } from '../redux/chatSlice';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatFooter = () => {
    const dispatch = useDispatch();
    const { roomId } = useSelector((state) => state.chat);
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
        if (message.trim() === '') return;

        const newMessage = {
            roomId,
            userId: user.id,
            username: user.username,
            message,
        };

        dispatch(addMessage(newMessage));

        socket.emit('sendMessage', newMessage);
        setMessage('');
    };

    return (
        <div className="input-group chat_footer">
            <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
            />
            <button className="btn btn-success sendBtn" onClick={handleSendMessage}>
                Send
            </button>
        </div>
    );
};

export default ChatFooter;
