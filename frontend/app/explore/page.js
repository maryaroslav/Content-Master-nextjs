import React from "react";
import HeaderMain from '../../components/HeaderMain';
import NavBar from '../../components/NavBar';
import NavBarLeft from '../../components/NavBarLeft'
import NavBarRight from '../../components/NavBarRight'
import Feed from "../../components/Feed";

import '../../styles/main.css'

const Main = () => {
    return (
        <div className="page-container">
            <HeaderMain />
            <NavBar />
            <div className="main-info-container">
                <NavBarLeft />
                <Feed />
                <NavBarRight />
            </div>
        </div>
    );
}

export default Main;