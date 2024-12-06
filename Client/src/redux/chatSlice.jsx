import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRooms = createAsyncThunk("chat/fetchRooms", async () => {
  const response = await fetch(`${API_BASE_URL}/rooms`);
  const data = await response.json();
  return data;
});

export const addRoom = createAsyncThunk("chat/addRoom", async (roomData) => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roomData),
  });
  return await response.json();
});

export const deleteRoom = createAsyncThunk("chat/deleteRoom", async (roomId) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return roomId;
  }
);

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (roomId) => {
    const response = await fetch(`${API_BASE_URL}/messages/${roomId}`);
    const data = await response.json();
    console.log(data)
    return { roomId, messages: data };
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    const savedMessage = await response.json();
    return savedMessage;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    rooms: [],
    currentRoom: null,
    messages: {},
    status: "idle",
  },
  reducers: {
    addMessage: (state, action) => {
      const { roomId, ...message } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(message);
    },
    setRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.rooms = action.payload;
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { roomId, messages } = action.payload;
        state.messages[roomId] = messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { roomId, ...message } = action.payload;
        if (!state.messages[roomId]) {
          state.messages[roomId] = [];
        }
        state.messages[roomId].push(message);
      });
  },
});

export const { addMessage, setRoom } = chatSlice.actions;

export default chatSlice.reducer;
