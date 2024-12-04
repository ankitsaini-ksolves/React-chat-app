import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice'
import postsReducer from './postSlice';
import modalReducer from './modalSlice'
import detailReducer from './detailSlice'


const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        posts: postsReducer,
        modal: modalReducer,
        postDetails: detailReducer
    },
});

export default store;