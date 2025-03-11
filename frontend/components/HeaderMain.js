"use client";

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { getCurrentUser } from '../utils/getCurrentUser';

import '../styles/headerMain.css';
import logo from '../public/img/logo/logo.svg';
import search from '../public/img/icons/search.svg';
import message from '../public/img/icons/message.svg';
import kolokolchik from '../public/img/icons/notification.svg';
import user from '../public/img/icons/user.svg';
import arrowDown from '../public/img/icons/arrow-down.svg';

const HeaderMain = () => {
    const router = useRouter();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        router.push('/register')
    }

    const handleToMain = (event) => {
        event.preventDefault();
        router.push('/')
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
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <nav className='nav'>
                <Link href="/" className='link'><Image src={message} alt="" /></Link>
                <Link href="/" className='link'><Image src={kolokolchik} alt="" /></Link>
                <div className="user-container">
                    <div className="user">
                        <div className="user-img">
                            <Image src={user} alt=""/>
                        </div>
                        <div className="user-name">
                            <p></p>
                        </div>
                        <div className="user-modal">
                            <Image src={arrowDown} alt="" />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default HeaderMain;