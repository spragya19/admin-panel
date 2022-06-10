import { configureStore } from "@reduxjs/toolkit";
import logSlice from "./Reducers";

const store = configureStore({
    reducer: {
        logReducer: logSlice.reducer
    }
});

export default store;