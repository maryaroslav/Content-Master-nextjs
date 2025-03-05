import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("currentUser")) || null : null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('currentUser')
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;