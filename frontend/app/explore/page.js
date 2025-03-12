"use client";

import React from "react";

import HeaderMain from '../../components/headers/HeaderMain';
import NavBar from '../../components/NavBar';
import NavBarLeft from '../../components/sidebars/NavBarLeft'
import NavBarRight from '../../components/sidebars/NavBarRight'
import Feed from "../../components/feeds/Feed";

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