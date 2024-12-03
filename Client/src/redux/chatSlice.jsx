import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (roomId) => {
        const response = await fetch(`http://localhost:5000/messages/${roomId}`);
        const data = await response.json();
        return data;
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        roomId: null,
        status: 'idle',
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setRoom: (state, action) => {
            state.roomId = action.payload;
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchMessages.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { addMessage, setRoom } = chatSlice.actions;

export default chatSlice.reducer;
