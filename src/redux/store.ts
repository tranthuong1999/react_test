import { configureStore } from "@reduxjs/toolkit";
import employeerSlice from "./slice/employeer.slice";


const store = configureStore({
    reducer: {
        employeerReducer: employeerSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
