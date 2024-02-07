import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
       logInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        logInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        logInFailure: (state, action) => {
            state.loading= false;
            state.error = action.payload;
        },

        updateUserStart: (state) => {
            state.loading = false;
        },

        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },

        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        deleteUserStart: (state) => {
            state.loading = true;
        },

        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },

        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        signoutUserStart: (state) => {
            state.loading = true;
        },

        signoutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },

        signoutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { 
    logInStart, 
    logInSuccess, 
    logInFailure, 
    updateUserFailure, 
    updateUserSuccess, 
    updateUserStart,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutUserStart,
    signoutUserSuccess,
    signoutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;