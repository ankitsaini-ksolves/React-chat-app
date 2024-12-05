import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRoom, fetchMessages } from '../redux/chatSlice';
import NewRoom from './NewRoom';

const ChatBar = () => {
    const [rooms, setRooms] = useState([]);
    const dispatch = useDispatch();
    const currentRoom = useSelector((state) => state.chat.roomId);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://localhost:5000/rooms');
                const data = await response.json();
                setRooms(data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
        fetchRooms();
    }, []);

    const handleRoomClick = (roomId) => {
        if (roomId !== currentRoom) {
            dispatch(setRoom(roomId));
            dispatch(fetchMessages(roomId));
        }
    };

    const handleRoomAdded = (newRoom) => {
        setRooms((prevRooms) => [...prevRooms, newRoom]);
    };

    return (
        <div className="chat_bar">
            <h4>Chat Rooms</h4>
            <NewRoom onRoomAdded={handleRoomAdded} />
            <div className="mt-3 rooms">
                {rooms.map((room) => (
                    <p
                        key={room.id}
                        onClick={() => handleRoomClick(room.id)}
                        className={`room-item ${currentRoom === room.id ? 'active-room' : ''}`}
                        style={{ cursor: 'pointer', color: currentRoom === room.id ? 'blue' : 'black' }}
                    >
                        {room.name}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default ChatBar;
