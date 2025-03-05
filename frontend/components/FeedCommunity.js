"use client";

import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import '../styles/feedCommunity.css'
import arrowDown from '../img/arrow-down.svg';

const FeedCommunity = () => {
    // const dispatch = useDispatch();
    const [communities, setCommunities] = useState([]);

    // useEffect(() => {
    //     fetch('/data/community.json')
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setCommunities(data);
    //         })
    //         .catch((err) => console.error('Error loading communities:', err));
    // }, [dispatch]);

    return (
        <div className='feedcomunnity-grey'>
            <div className="feedcommunity-container">
                {communities.map((community, index) => (
                    <div key={index} className="feedcommunity-item">
                        <Image src={community.img} alt={community.title}/>
                        <div className="feedcommunity-item-title">
                            <p className="feedcommunity-type">{community.type}</p>
                            <p className="feedcommunity-name">{community.title}</p>
                            <p className="feedcommunity-members">{community.members} Members</p>
                        </div>
                        <div className='feedcommunity-arrow'>
                            <Image src={arrowDown} alt="" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedCommunity;