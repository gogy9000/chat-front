import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {io} from "socket.io-client";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatchType, AppRootStateType} from "./Store/Store";
import {
    chatSlice,
    createConnection,
    destroyConnection,
    fetchMessage,
    fetchTypingSignal,
    setClientName
} from "./Store/ChatSlice";


function App() {
    const [message, setMessage] = useState("h")
    const [name, setName] = useState("")
    const [isAutoScroll, setIsAutoScroll] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    const messages = useSelector((state: AppRootStateType) => state.chat.messages)
    const typingUsersList = useSelector((state: AppRootStateType) => state.chat.typingUsersList)

    const dispatch: AppDispatchType = useDispatch()

    useEffect(() => {
        dispatch(createConnection())
        return () => {
            dispatch(destroyConnection())
        }
    }, [])
    useEffect(() => {
        if (isAutoScroll) {
            messageAnchorBlockRef.current?.scrollIntoView({behavior: "smooth"})
        }
    },)

    const messageAnchorBlockRef = useRef<HTMLDivElement>(null)

    return (
        <div className="App">
            <div>
                <div
                    onScroll={(e) => {
                        let element = e.currentTarget;
                        let maxScrollPosition = element.scrollHeight - element.clientHeight
                        if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10) {

                            setIsAutoScroll(true)

                        } else {
                            setIsAutoScroll(false)
                        }
                        setLastScrollTop(element.scrollTop)
                    }}
                    style={{border: "1px solid black", width: 300, padding: 10, height: 300, overflowY: "scroll"}}>
                    {messages.map(m => {
                        return (
                            <div key={m.id}>
                                <b>{m.user.name}:</b>{m.message}
                                {typingUsersList[m.user.id]&&<span>...</span>}
                                <hr/>
                                <div ref={messageAnchorBlockRef}/>
                            </div>

                        )
                    })}
                </div>
                <input value={name} onChange={event => setName(event.currentTarget.value)}/>
                <button onClick={() => {
                    dispatch(setClientName(name))
                }}>send name
                </button>
                <textarea value={message} onChange={event => {
                    dispatch(fetchTypingSignal())
                    setMessage(event.currentTarget.value)
                }}/>
                <button onClick={() => {
                    dispatch(fetchMessage(message))

                    setMessage("")
                }}>send
                </button>
            </div>
        </div>
    );
}

export default App;
