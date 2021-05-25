import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userslice";

export default configureStore({
    reducer: {
        user: userReducer
    }
})