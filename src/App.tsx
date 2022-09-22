import React, {ChangeEvent, ChangeEventHandler, useEffect, useRef, useState} from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatchType, AppRootStateType} from "./Store/Store";
import {
    createConnection,
    destroyConnection,
    fetchMessage, fetchNotTypingSignal,
    fetchTypingSignal,
    setClientName
} from "./Store/ChatSlice";
import {useDebouncedEffect} from "./CustomHooks/CustomHooks";


function App() {
    const [message, setMessage] = useState("")
    const [name, setName] = useState("")
    const [isAutoScroll, setIsAutoScroll] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)
    const [isTyping,setIsTyping]=useState(false)

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

    const notTyping=()=>{
        console.log("not typing")
        dispatch(fetchNotTypingSignal())
        setIsTyping(false)
    }

    useDebouncedEffect(notTyping,[message],1000)

    const onChangeText = (event:ChangeEvent<HTMLTextAreaElement>) => {
        if(!isTyping){
            console.log("typing")
            dispatch(fetchTypingSignal())
            setIsTyping(true)
        }
        setMessage(event.currentTarget.value)
    };

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
                <textarea value={message} onChange={onChangeText}/>
                <button onClick={() => {
                    dispatch(fetchMessage(message))
                    dispatch(fetchNotTypingSignal())
                    setMessage("")
                }}>send
                </button>
            </div>
        </div>
    );
}

export default App;
