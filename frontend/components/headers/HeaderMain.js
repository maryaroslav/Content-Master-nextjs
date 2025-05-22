"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/app/lib/apiClient";

import '@/styles/headerMain.css';
import logo from '@/public/img/logo/logo.svg';
import search from '@/public/img/icons/search.svg';
import message from '@/public/img/icons/message.svg';
import kolokolchik from '@/public/img/icons/notification.svg';
import userImg from '@/public/img/icons/user.svg';
import arrowDown from '@/public/img/icons/arrow-down.svg';
import userModal from '../modals/userModal';

const HeaderMain = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await fetchWithAuth("http://localhost:5000/api/user/me");
                if (data) setUser(data);
            } catch (err) {
                console.error("Error loading user", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);


    const handleToMain = (event) => {
        event.preventDefault();
        router.push('/explore');
    }

    const handleToChat = (event) => {
        event.preventDefault();
        router.push('/chat');
    }

    const handleToProfileUser = (event) => {
        event.preventDefault();
        if (user?.username) {
            router.push(`/profile/${user.username}`);
        }
    }

    return (
        <header className='header-main'>
            <div className='logo' onClick={handleToMain}>
                <Image src={logo} alt="logo" />
                <p>Content Master</p>
            </div>
            <div className="search-container">
                <div className="search">
                    <Image src={search} alt="" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchInput.trim()) {
                                router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
                            }
                        }}
                    />
                </div>
            </div>
            <nav className='nav'>
                <Link href="/chat" className='link'><Image src={message} alt="" /></Link>
                <Link href="/" className='link'><Image src={kolokolchik} alt="" /></Link>
                <div className="user-container">
                    <div className="user">
                        <div className="user-img" onClick={handleToProfileUser}>
                            {user?.profile_picture ? (
                                <Image src={`http://localhost:5000/uploads/${user.profile_picture}`} alt="user avatar" width={100} height={100} />
                            ) : (
                                <Image src={userImg} alt="Default user icon" />
                            )}

                        </div>
                        <div className="user-name">
                            <p>{loading ? 'Loading...' : user ? user.username : '...'}</p>
                        </div>
                        <div className="user-modal" onClick={() => setIsOpen((prev) => !prev)}>
                            <Image src={arrowDown} alt="" />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default HeaderMain;