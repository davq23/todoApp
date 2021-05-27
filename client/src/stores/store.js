import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userslice";
import taskReducer from "../slices/taskslice";

export default configureStore({
    reducer: {
        user: userReducer,
        tasks: taskReducer
    }
})