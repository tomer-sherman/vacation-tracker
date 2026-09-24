import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./app-state";
import { userSlice } from "./user-slice";
import { vacationSlice } from "./vacation-slice";


export const store = configureStore<AppState>({
    reducer: {
        user: userSlice.reducer,
        vacation: vacationSlice.reducer
    }
})