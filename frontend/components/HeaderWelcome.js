import React from "react";
import Image from 'next/image'
import Link from 'next/link'
import '../styles/headerWelcome.css';
import logo from '../img/logo.svg';

const HeaderWelcome = () => {
    return (
        <header className='header'>
            <div className='logo'>
                <Image src={logo} alt="logo"></Image>
                <p>Content Master</p>
            </div>
            <nav className='nav'>
                <Link href="/sign-in" className='link'>Sign In</Link>
                <Link href="/sign-up" className='link special'>Sign Up</Link>
            </nav>
        </header>
    );
}

export default HeaderWelcome;