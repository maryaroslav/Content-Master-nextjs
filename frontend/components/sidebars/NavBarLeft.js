"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

import '@/styles/navBarLeft.css'

import arrowDown from '@/public/img/icons/arrow-down.svg';

const NavBarLeft = () => {
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [events, setEvents] = useState([]);
  // useEffect(() => {
  //   fetch("/data/community.json")
  //     .then((res) => res.json())
  //     .then((data) => setCommunities(data))
  //     .catch((err) => console.error(err))

  //   fetch("/data/events.json")
  //     .then((res) => res.json())
  //     .then((data) => setEvents(data))
  //     .catch((err) => console.error(err))
  // }, []);

  return (
    <div className="sidebar-container">
      <div>
        <div className='sidebar-name' onClick={() => setShowAllCommunities(!showAllCommunities)}>
          <p className="sidebar-title">My Community</p>
          <Image src={arrowDown} alt="" className={showAllCommunities ? "rotated" : "180deg"}/>
        </div>
        <div className="community-list">
          {(showAllCommunities ? communities : communities.slice(0, 4)).map((community, index) => (
            <div key={index} className="community-item">
              <Image src={community.img} alt=""/>
              <div key={index} className='item-title'>
                <p className="community-type">{community.type}</p>
                <p className="community-name">{community.title}</p>
                <p className="community-members">{community.members} Members</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="events-section">
        <div className='sidebar-name' onClick={() => setShowAllEvents(!showAllEvents)}>
          <p className="sidebar-title">Events</p>
          <Image src={arrowDown} alt="" className={showAllEvents ? "rotated" : ""}/>
        </div>
        <div className="event-list">
          {(showAllEvents ? events : events.slice(0, 6)).map((event, index) => (
            <div key={index} className="event-item">
              <Image src={event.img} alt=""/>
              <div key={index} className='item-title'>
                <p className="event-date">{event.date}</p>
                <p className="event-name">{event.name}</p>
                <p className="event-attendees">{event.people} people have joined this event</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NavBarLeft;