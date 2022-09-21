import {configureStore} from "@reduxjs/toolkit";
import {chatSlice} from "./ChatSlice";

export const  store=configureStore({
    reducer:{
        chat:chatSlice.reducer
    }
})

export type AppRootStateType=ReturnType<typeof store.getState>
export type AppDispatchType=typeof store.dispatch