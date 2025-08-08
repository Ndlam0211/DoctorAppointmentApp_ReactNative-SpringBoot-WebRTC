import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import appointmentReducer from "./screens/appointment"

const rootReducer = combineReducers({
    appointment: appointmentReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;