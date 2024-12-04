import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPostDetails = createAsyncThunk('details/fetchPostDetails', async (id) => {
  const response = await fetch(`http://localhost:5000/posts/${id}`);
  const data = await response.json();
  return data;
});

const detailSlice = createSlice({
  name: 'postDetails',
  initialState: {
    post: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPostDetails: (state) => {
      state.post = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearPostDetails } = detailSlice.actions;

export default detailSlice.reducer;
