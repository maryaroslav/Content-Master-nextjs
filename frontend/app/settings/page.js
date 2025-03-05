import React from "react";
import HeaderMain from '../../components/HeaderMain';
import NavBar from '../../components/NavBar';
import NavBarLeft from '../../components/NavBarLeft'
import NavBarRight from '../../components/NavBarRight'
import FeedEvent from "../../components/FeedEvent";

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