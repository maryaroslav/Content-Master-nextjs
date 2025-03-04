import React from "react";
import HeaderMain from '../../components/HeaderMain';
import NavBar from '../../components/NavBar';
import NavBarLeft from '../../components/NavBarLeft'
import NavBarRight from '../../components/NavBarRight'
import FeedCommunity from '../../components/FeedCommunity';

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