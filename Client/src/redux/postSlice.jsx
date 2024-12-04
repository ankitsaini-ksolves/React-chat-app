import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await fetch('http://localhost:5000/posts');
  const data = await response.json();
  return data;
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
  addPost: (state, action) => {
    state.posts.push(action.payload);
  },
  updatePost: (state, action) => {
    const index = state.posts.findIndex((post) => post.id === action.payload.id);
    if (index !== -1) {
      state.posts[index] = action.payload;
    }
  },
  deletePost: (state, action) => {
    state.posts = state.posts.filter((post) => post.id !== action.payload);
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {addPost, updatePost, deletePost } = postSlice.actions;

export default postSlice.reducer;
