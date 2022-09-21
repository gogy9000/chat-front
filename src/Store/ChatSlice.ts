import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Api} from "../Api";

export const createConnection= createAsyncThunk("chat/createConnection",(param,APIThunk)=>{
    Api.createConnection()
    Api.subscribe(
        (messages)=>{
            APIThunk.dispatch(chatSlice.actions.messagesReceived(messages))
        },
        (message)=>{
            APIThunk.dispatch(chatSlice.actions.removeTypingUser({id: message.user.id}))
            APIThunk.dispatch(chatSlice.actions.newMessagesReceived(message))

        },
        (user)=>{
            APIThunk.dispatch(chatSlice.actions.addTypingUser({id: user.id}))
        }
    )
})
export const setClientName=createAsyncThunk("chat/setClientName",(name:string,ApiThunk)=>{
    Api.sendName(name)

})
export const fetchMessage=createAsyncThunk("chat/fetchMessage",(message:string,ApiThunk)=>{
Api.sendMessage(message)
})

export const destroyConnection= createAsyncThunk("chat/destroyConnection",(param,APIThunk)=>{
Api.destroyConnection()
})
export const fetchTypingSignal=createAsyncThunk("chat/fetchTypingSignal",(param,ApiThunk)=>{
    Api.sendTypingSignal()
})

export type MessagesEntity = {
    message: string, id: string, user: { id: string, name: string }
}

export const chatSlice=createSlice({
    name:"chat",
    initialState:{
        messages:[] as MessagesEntity[],
        typingUsersList:{} as {[id:string]:boolean}
    },
    reducers:{
        messagesReceived:(state,action:PayloadAction<MessagesEntity[]>)=>{
            state.messages=action.payload
        },
        newMessagesReceived:(state,action:PayloadAction<MessagesEntity>)=>{
            state.messages.push(action.payload)
        },
        addTypingUser:(state,action:PayloadAction<{ id:string }>)=>{
            state.typingUsersList={...state.typingUsersList,[action.payload.id]:true}
        },
        removeTypingUser:(state,action:PayloadAction<{ id:string }>)=>{
          delete  state.typingUsersList[action.payload.id]
        }

    },
    extraReducers:(builder => {
        builder.addCase(createConnection.fulfilled,(state,action)=>{
        })
    })
})