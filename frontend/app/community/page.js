import React from "react";
import HeaderMain from '../../components/headers/HeaderMain';
import NavBar from '../../components/NavBar';
import NavBarLeft from '../../components/sidebars/NavBarLeft'
import NavBarRight from '../../components/sidebars/NavBarRight'
import FeedCommunity from '../../components/feeds/FeedCommunity';

import '../../styles/main.css'

const CommunityPage = () => {
    return (
        <div className="page-container">
            <HeaderMain />
            <NavBar />
            <div className="main-info-container">
                <NavBarLeft />
                <FeedCommunity />
                <NavBarRight />
            </div>
        </div>
    );
}

export default CommunityPage;