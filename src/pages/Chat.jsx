import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks';
import axios from 'axios';

const Chat = () => {
    const [msg, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const { authUser } = useAuth();
    const { id } = useParams();
    const [oppositeUser, setOppositeUser] = useState(null);
    const socket = useMemo(() => io('https://backend-blog-28ea.onrender.com'), []);

    const messagesRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);
    const fetchOppositeUser=async()=>{
        try{
            const response=await axios.get(`https://backend-blog-28ea.onrender.com/api/user/${id}`);
            console.log(response.data);
            setOppositeUser(response.data);
        }catch(err){
            console.error(err);
        }
    }

    useEffect(() => {
        let mounted = true;
        fetchOppositeUser();
        authUser
            .then((res) => {
                if (!mounted) return;
                setUserInfo(res);

                if (res?._id) {
                    socket.on('connect', () => {
                        socket.emit('register', res._id);
                    });
                }
            })
            .catch((err) => console.error(err));

        socket.on('receiveMessage', (msgData) => {
            setMessages((prev) => [...prev, msgData]);
        });

        return () => {
            mounted = false;
            socket.off('receiveMessage');
            socket.off('connect');
            socket.disconnect();
        };
    }, [authUser, socket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = msg.trim();
        if (!text || !userInfo) return;

        const payload = {
            msg: text,
            to_id: id,
            from_id: userInfo._id,
            from_name: userInfo.name,
            createdAt: new Date().toISOString(),
        };

        socket.emit('sendMessage', payload);
        setMessages((prev) => [...prev, { ...payload, self: true }]);
        setMessage('');
    };

    const formatTime = (iso) => {
        try {
            return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (err) {
            return err;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-3xl h-[98vh] sm:h-[90vh] bg-white rounded-lg sm:rounded-xl shadow-lg flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 border-b bg-white sticky top-0 z-10">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-200 flex items-center justify-center text-base sm:text-lg font-semibold text-green-700">
                        {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{oppositeUser?.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Online</div>
                    </div>
                </div>

                {/* Messages */}
                <div ref={messagesRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-white to-gray-50">
                    {messages.length === 0 && (
                        <div className="text-center text-sm text-gray-400 mt-8">No messages yet — say hello 👋</div>
                    )}

                    {messages.map((item, idx) => {
                        const isMe = item.from_id === userInfo?._id || item.self;
                        return (
                            <div key={idx} className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'} gap-2 sm:gap-3`}>
                                {!isMe && (
                                    <div className="flex-shrink-0">
                                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-700">
                                            {item.from_name ? item.from_name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </div>
                                )}

                                <div className={`max-w-[80%] sm:max-w-[75%] px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-sm text-xs sm:text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                                    <div className="text-xs font-semibold opacity-80 mb-1">{isMe ? 'You' : item.from_name}</div>
                                    <div className="whitespace-pre-wrap">{item.msg}</div>
                                    <div className="text-[11px] opacity-60 text-right mt-1">{formatTime(item.createdAt)}</div>
                                </div>

                                {isMe && (
                                    <div className="flex-shrink-0 ml-3">
                                        <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center text-sm font-medium text-green-700">You</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Input area */}
                <form onSubmit={handleSubmit} className="border-t px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 bg-white">
                    <button type="button" className="text-gray-500 hover:text-gray-700 p-1.5 sm:p-2 rounded-md flex-shrink-0" title="Emoji" aria-label="Add emoji">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                        </svg>
                    </button>

                    <input
                        autoFocus
                        value={msg}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 auto-focus border border-gray-300 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="Type a message..."
                        aria-label="Message"
                    />

                    <button 
                        type="submit" 
                        className="inline-flex items-center justify-center flex-shrink-0 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        <span className="hidden sm:inline ml-2">Send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
