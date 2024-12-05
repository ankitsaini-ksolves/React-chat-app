import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { setRoom, fetchMessages } from '../redux/chatSlice';
import ChatFooter from '../components/ChatFooter';
import ChatBody from '../components/ChatBody';
import ChatBar from '../components/ChatBar';
import '../App.css'
import { useDispatch } from 'react-redux';

const socket = io('http://localhost:5000');

const ChatRoom = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDefaultRoom = async () => {
            try {
                const response = await fetch('http://localhost:5000/rooms');
                const rooms = await response.json();

                if (rooms.length > 0) {
                    const defaultRoom = rooms[0].id;
                    dispatch(setRoom(defaultRoom));
                    dispatch(fetchMessages(defaultRoom));
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchDefaultRoom();
    }, [dispatch]);
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
