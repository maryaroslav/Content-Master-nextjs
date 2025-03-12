"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
// import { getCurrentUser } from '../utils/getCurrentUser';

import HeaderWelcome from "../components/headers/HeaderWelcome";
import '../styles/welcome.css';

import bag from '../public/img/first_page/bag.svg';
import ball from '../public/img/first_page/ball.svg';
import bank from '../public/img/first_page/bank.svg';
import heart from '../public/img/first_page/heart.svg';
import green from '../public/img/first_page/green.svg';
import fire from '../public/img/first_page/fire.svg';
import gamepad from '../public/img/first_page/gamepad.svg';
import guitar from '../public/img/first_page/guitar.svg';
import hat from '../public/img/first_page/hat.svg';
import light from '../public/img/first_page/light.svg';
import like from '../public/img/first_page/like.svg';
import tent from '../public/img/first_page/tent.svg';
import smile from '../public/img/first_page/smile.svg'
import hand from '../public/img/first_page/hand.svg'
import ship from '../public/img/first_page/ship.svg'

const Welcome = () => {
    const router = useRouter();
    // const currentUser = getCurrentUser();

    useEffect(() => {
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, []);

    const handleClick = () => {
        if (currentUser) {
            router.push('/explore')
        } else {
            router.push('/login')
        }
    }

    return (
        <div className="welcome">
            <HeaderWelcome />
            <div className="info-container">
                <div className="info">
                    <div className="info-title">
                        <h1>Join the Chatvolution</h1>
                    </div>
                    <div className="info-text">
                        <p>Ask questions, share ideas, and build connections with each other.</p>
                    </div>
                    <div className="info-button">
                        <a onClick={handleClick}>Join Content Master Community <Image src={ship} alt="ship"></Image></a>
                    </div>
                </div>
            </div>
            <div className="circles-container">
                <div className="circle-1 circle">
                    <div className="emoji-greyBackground greyBackground">
                        <Image src={hat} alt="hat"></Image>
                    </div>
                    <div className="emoji-greyBackground greyBackground">
                        <Image src={fire} alt="fire"></Image>
                    </div>
                    <div className="circle-2 circle">
                        <div className="emoji-container">
                            <Image src={heart} alt="heart"></Image>
                        </div>
                        <div className="emoji-greyBackground greyBackground">
                            <Image src={bank} alt="bank"></Image>
                        </div>
                        <div className="emoji-greyBackground greyBackground">
                            <Image src={guitar} alt="guitar"></Image>
                        </div>
                        <div className="emoji-container">
                            <Image src={green} alt="green"></Image>
                        </div>
                        <div className="emoji-container">
                            <Image src={green} alt="green"></Image>
                        </div>
                        <div className="emoji-greyBackground greyBackground">
                            <Image src={ball} alt="ball"></Image>
                        </div>
                        <div className="circle-3 circle">
                            <div className="emoji-greyBackground greyBackground">
                                <Image src={bag} alt="bag"></Image>
                            </div>
                            <div className="emoji-greyBackground greyBackground">
                                <Image src={tent} alt="tent"></Image>
                            </div>
                            <div className="emoji-greyBackground greyBackground">
                                <Image src={gamepad} alt="gamepad"></Image>
                            </div>
                            <div className="emoji-greyBackground greyBackground">
                                <Image src={light} alt="light"></Image>
                            </div>
                            <div className="emoji-container">
                                <Image src={heart} alt="heart"></Image>
                            </div>
                            <div className="circle-4 circle">
                                <div className="emoji-greyBackground greyBackground">
                                    <Image src={like} alt="like"></Image>
                                </div>
                                <div className="emoji-greyBackground greyBackground">
                                    <Image src={smile} alt="smile"></Image>
                                </div>
                                <div className="emoji-greyBackground greyBackground">
                                    <Image src={hand} alt="hand"></Image>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;