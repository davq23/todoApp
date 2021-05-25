import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userID: null,
        username: '',
    },
    reducers: {
        login: (state, action) => {
            return {
                ...state.user,
                ...action.payload,
            }
        },
        logout: (state) => {
            const payLoad = {
                userID: false,
            }

            return {
                ...payLoad,
            };
        }
    }
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user.userID;
export const selectUsername = (state) => state.user.username;

export default userSlice.reducer;