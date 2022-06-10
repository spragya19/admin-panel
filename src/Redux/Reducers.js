import { createSlice } from "@reduxjs/toolkit";

const initialState = {loggedIn: false};

const logSlice = createSlice({
    name: "LoginLogoutSlice",
    initialState,
    reducers: {
        login(action, state) {
            state.loggedIn = true
        },
        logout(action, state) {
            state.loggedIn = false
        }
    }
});

export default logSlice;