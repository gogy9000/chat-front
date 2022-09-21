import {io, Socket} from "socket.io-client";


import {MessagesEntity} from "./Store/ChatSlice";







export const Api={
    socket:null as null| Socket,
    createConnection(){
         this.socket = io("http://localhost:3009")
    },
    subscribe(
        initMessagesHandler:(messages:MessagesEntity[])=>void,
        newMessageSentHandler:(message:MessagesEntity)=>void,
        getTypingUser:(user:{id:string,name:string})=>void
    ){
        this.socket?.on('init-messages-published', initMessagesHandler)
        this.socket?.on('new-message-sent', newMessageSentHandler)
        this.socket?.on("user-typing",getTypingUser)
    },
    sendName(name:string){
        this.socket?.emit('client-name-sent', name)
    },
    sendMessage(message:string){
        this.socket?.emit("client-message-sent", message)
    },
    sendTypingSignal(){
        this.socket?.emit("client-typing")
    },
    destroyConnection(){
        this.socket?.disconnect()
        this.socket=null
    }
}

