"use client";

import { useState, useEffect, useRef } from "react";
import { getSession } from "next-auth/react";
import { fetchWithAuth } from "../lib/apiClient";
import Image from "next/image";
import userImg from '@/public/img/icons/user.svg';
import clipSVG from '@/public/img/icons/clip.svg';
import { io } from 'socket.io-client';
import { useSearchParams } from 'next/navigation';

import '@/styles/chat.css'

import useFollowedUsers from '@/components/chat/userListContainer';
import HeaderMain from "@/components/headers/HeaderMain";

export default function ChatPage() {
    const [socket, setSocket] = useState(null);
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    const [toUserId, setToUserId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [unreadMap, setUnreadMap] = useState({});
    const followed = useFollowedUsers(chat);
    const chatMessagesRef = useRef();
    const fileInputRef = useRef();
    const toUserIdRef = useRef(null);
    const searchParams = useSearchParams();
    const urlToUserId = searchParams.get('to');

    const companion = followed.find(user => user.user_id === toUserId);
    const companionName = companion?.username || `User ${toUserId}`;

    useEffect(() => {
        if (urlToUserId) {
            setToUserId(Number(urlToUserId));
        }
    }, [urlToUserId]);

    useEffect(() => {
        toUserIdRef.current = toUserId;
    }, [toUserId]);

    useEffect(() => {
        if (!toUserId) return;

        const loadHistory = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`http://localhost:5000/api/chat/message/${toUserId}`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`
                    }
                });
                const messages = await res.json();
                setChat(prev => {
                    const newIds = new Set(prev.map(m => m.created_at + m.from_user_id));
                    const merged = [...prev];
                    for (const m of messages) {
                        if (!newIds.has(m.created_at + m.from_user_id)) {
                            merged.push(m);
                        }
                    }
                    return merged;
                });
            } catch (err) {
                console.error('Error loading history: ', err)
            }
        };

        loadHistory();
    }, [toUserId]);

    useEffect(() => {
        const setupSocket = async () => {
            const session = await getSession();
            if (!session?.accessToken) return;

            const newSocket = io('http://localhost:5000', {
                auth: {
                    token: `Bearer ${session.accessToken}`
                }
            });

            const playload = JSON.parse(atob(session.accessToken.split('.')[1]));
            const userId = playload.user_id;
            setCurrentUserId(userId);

            const profile = await fetchWithAuth('http://localhost:5000/api/user/me', {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            });
            setCurrentUserProfile(profile);

            newSocket.on('private_message', (data) => {
                console.log('[socket] received:', data);

                if (!userId) return;

                const isCurrentChat =
                    (data.from_user_id === toUserIdRef.current && data.to_user_id === userId) ||
                    (data.from_user_id === userId && data.to_user_id === toUserIdRef.current);

                setChat((prev) => {
                    const exists = prev.some(m =>
                        new Date(m.created_at).getTime() === new Date(data.created_at).getTime() &&
                        m.from_user_id === data.from_user_id
                    );
                    if (exists) return prev;

                    const normalized = {
                        ...data,
                        content: data.content || data.message || ''
                    };

                    return [...prev, normalized];
                });
                if (
                    toUserIdRef.current !== data.from_user_id &&
                    data.from_user_id !== currentUserId
                ) {
                    setUnreadMap((prev) => ({
                        ...prev,
                        [data.from_user_id]: true
                    }));
                }
            });

            newSocket.on('connect_error', (err) => {
                console.error('Connection error', err.message);
            });

            setSocket(newSocket);

            return () => newSocket.disconnect();
        };
        setupSocket();
    }, []);

    useEffect(() => {
        const textarea = document.querySelector('.textarea-auto');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [message]);

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chat]);

    useEffect(() => {
        if (toUserId) {
            setUnreadMap((prev) => {
                const updated = { ...prev };
                delete updated[toUserId];
                return updated;
            })
        }
    }, [toUserId]);

    const sendMessage = () => {
        if (!socket || !toUserId || !message.trim()) return;
        socket.emit('private_message', {
            toUserId: parseInt(toUserId),
            message: String(message),
            type: 'text'
        });
        setMessage('');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const session = await getSession();
        const res = await fetch('http://localhost:5000/api/chat/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            body: formData
        });

        if (!res.ok) {
            console.error('[upload] Failed to upload image');
            return;
        }

        const data = await res.json();

        if (!data.url) {
            console.error('[upload] No image URL returned');
            return;
        }

        console.log('[upload] image URL:', data.url);

        if (socket && data.url && toUserId) {
            socket.emit('private_message', {
                toUserId: parseInt(toUserId),
                message: '',
                media_url: data.url,
                type: 'image'
            });
        }
    }

    return (
        <div className="chat-container">
            <HeaderMain />
            <div className="chat-body">
                <div className="chat-sidebar">
                    <ul style={{ listStyle: 'none', padding: 0 }} className="chat-user-list">
                        {followed.map(user => (
                            <li
                                key={user.user_id}
                                className={`chat-user-item ${user.user_id === toUserId ? 'active' : ''}`}
                                onClick={() => setToUserId(user.user_id)}
                            >
                                <Image
                                    src={
                                        user.profile_picture
                                            ? `http://localhost:5000/uploads/${user.profile_picture}`
                                            : userImg
                                    }
                                    alt={user.username}
                                    width={32}
                                    height={32}
                                />
                                {user.username}
                                {unreadMap[user.user_id] && (
                                    <span
                                        style={{
                                            marginLeft: 'auto',
                                            width: 8,
                                            height: 8,
                                            backgroundColor: '#0095ff73',
                                            borderRadius: '50%'
                                        }}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ flex: 1 }} className="chat-main">
                    {toUserId && (
                        <div className="chat-header">
                            <Image
                                src={
                                    companion?.profile_picture
                                        ? `http://localhost:5000/uploads/${companion.profile_picture}`
                                        : userImg
                                }
                                alt={companionName}
                                width={35}
                                height={35}
                                style={{ borderRadius: '50%' }}
                            />
                            <h3>
                                {toUserId
                                    ? `${companionName}`
                                    : 'Выберите собеседника'}
                            </h3>
                        </div>
                    )}
                    <div className="chat-messages" ref={chatMessagesRef}>
                        {!toUserId ? (
                            <div className="chat-placeholder">Select a chat to start messaging</div>
                        ) : (

                            chat
                                .filter(msg =>
                                    (msg.from_user_id === toUserId && msg.to_user_id === currentUserId) ||
                                    (msg.from_user_id === currentUserId && msg.to_user_id === toUserId)
                                )
                                .map((msg, i) => {
                                    const isCurrentUser = msg.from_user_id === currentUserId;
                                    const username = isCurrentUser
                                        ? currentUserProfile?.username || 'Вы'
                                        : msg.FromUser?.username || `User ${msg.from_user_id}`;
                                    const avatarUrl = isCurrentUser
                                        ? currentUserProfile?.profile_picture
                                            ? `http://localhost:5000/uploads/${currentUserProfile.profile_picture}`
                                            : userImg
                                        : msg.FromUser?.profile_picture
                                            ? `http://localhost:5000/uploads/${msg.FromUser.profile_picture}`
                                            : userImg;

                                    return (
                                        <div key={i} className={`chat-message ${isCurrentUser ? 'chat-message-self' : 'chat-message-other'}`} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                            <div className="chat-message-content">
                                                <div className="chat-message-author">
                                                    <Image
                                                        src={avatarUrl}
                                                        alt={username}
                                                        width={32}
                                                        height={32}
                                                        style={{ borderRadius: '50%', marginRight: 8 }}
                                                    />
                                                    <div className="message-container">
                                                        {msg.type === 'image' && msg.media_url ? (

                                                            <Image
                                                                src={`http://localhost:5000${msg.media_url}`}
                                                                alt="photo"
                                                                width={200}
                                                                height={200}
                                                                style={{ borderRadius: 8 }}
                                                            />
                                                        ) : (
                                                            <span>{msg.content}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                    {toUserId && (
                        <div className="chat-input-container">
                            <div style={{ marginTop: 10 }} className="chat-input-block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                                <Image
                                    src={clipSVG}
                                    alt="clip"
                                    width={25}
                                    height={25}
                                    onClick={() => fileInputRef.current?.click()}
                                />
                                <textarea
                                    value={typeof message === 'string' ? message : ''}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Write a message..."
                                    className="chat-input textarea-auto"
                                    rows={1}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}