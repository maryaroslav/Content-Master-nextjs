'use client';

import { useState } from 'react';
import Image from 'next/image';

import '@/styles/navBarLeft.css'

import arrowDown from '@/public/img/icons/arrow-down.svg';

const NavBarLeft = ({ communities }) => {
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [events, setEvents] = useState([]);

  return (
    <div className="sidebar-container">
      <div>
        <div className='sidebar-name' onClick={() => setShowAllCommunities(!showAllCommunities)}>
          <p className="sidebar-title">My Community</p>
          <Image src={arrowDown} alt="" className={showAllCommunities ? "rotated" : "180deg"} />
        </div>
        <div className="community-list">
          {(showAllCommunities ? communities : communities.slice(0, 4)).map((community, index) => (
            <div key={index} className="community-item">
              <Image src={`http://localhost:5000${community.image}`} width={100}
                height={100} alt="" />
              <div key={index} className='item-title'>
                <p className="community-type">{community.type}</p>
                <p className="community-name">{community.title}</p>
                <p className="community-members">{community.members_count} Members</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="events-section">
        <div className='sidebar-name' onClick={() => setShowAllEvents(!showAllEvents)}>
          <p className="sidebar-title">Events</p>
          <Image src={arrowDown} alt="" className={showAllEvents ? "rotated" : ""} />
        </div>
        <div className="event-list">
          {(showAllEvents ? events : events.slice(0, 6)).map((event, index) => (
            <div key={index} className="event-item">
              <Image src={event.img} alt="" />
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