"use client";

import React from "react";
import { useSession } from "next-auth/react";
import HeaderMain from '../../components/headers/HeaderMain';
import NavBar from '../../components/NavBar';
import NavBarLeft from '../../components/sidebars/NavBarLeft'
import NavBarRight from '../../components/sidebars/NavBarRight'
import FeedEvent from "../../components/feeds/FeedEvent";

import '../../styles/main.css'

const EventsPage = () => {
    return (
        <div className="page-container">
            <HeaderMain />
            <NavBar />
            <div className="main-info-container">
                <NavBarLeft />
                <FeedEvent />
                <NavBarRight />
            </div>
        </div>
    )
}

export default EventsPage;