"use client";

import React, { useEffect, useState } from 'react';
import '@/styles/feedCommunity.css'
import arrowDown from '@/public/img/icons/arrow-down.svg';

const FeedCommunity = () => {
    const [events, setEvents] = useState([]);

    return (
        <div className='feedcomunnity-grey'>
            <div className="feedcommunity-container">
                {events.map((event, index) => (
                    <div key={index} className="feedcommunity-item">
                        <Image src={event.img} alt={event.title} />
                        <div className="feedcommunity-item-title">
                            <p className="event-date">{event.date}</p>
                            <p className="feedcommunity-name">{event.name}</p>
                            <p className="feedcommunity-members">{event.people} people have joined this event</p>
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
