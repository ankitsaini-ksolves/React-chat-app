import React, { useState } from 'react';
import { toast } from "react-toastify";


const NewRoom = ({ onRoomAdded }) => {
    const [roomName, setRoomName] = useState('');

    const handleAddRoom = async () => {
        if (roomName.trim() === '') {
            alert('Room name cannot be empty');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: roomName }),
            });

            if (!response.ok) {
                throw new Error('Failed to add room');
            }

            const newRoom = await response.json();
            onRoomAdded(newRoom);
            setRoomName('');
            toast.success("Room added successfully!",{autoClose: 2000});
        } catch (error) {
            console.error('Error adding room:', error);
            alert('Failed to add room.');
        }
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
