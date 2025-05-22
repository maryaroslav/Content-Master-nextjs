'use client';

import { useState } from 'react';
import Image from 'next/image';

import '@/styles/navBarLeft.css'

import arrowDown from '@/public/img/icons/arrow-down.svg';

const NavBarLeft = ({ communities, events }) => {
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  const formatMembersCount = (count) => {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(count % 1_000_000 === 0 ? 0 : 1)}kk`;
    }
    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(count % 1_000 === 0 ? 0 : 1)}k`;
    }
    return count;
  }

  return (
    <div className="sidebar-container">
      <div className="communities-section">
        <div className='sidebar-name' onClick={() => setShowAllCommunities(!showAllCommunities)}>
          <p className="sidebar-title">My Community</p>
          <Image src={arrowDown} alt="" className={showAllCommunities ? "rotated" : "180deg"} />
        </div>
        <div className="community-list">
          {(showAllCommunities ? communities : communities.slice(0, 4)).map((community, index) => (
            <div key={community.community_id} className="community-item">
              <Image src={`http://localhost:5000${community.photo}`} width={100} height={100} alt="" />
              <div key={index} className='item-title'>
                <p className="community-type">{community.privacy}</p>
                <p className="community-name">{community.name}</p>
                <p className="community-members">{formatMembersCount(community.members_count)} Members</p>
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
            <div key={event.event_id} className="event-item">
              <Image src={`http://localhost:5000${event.image}`} width={100} height={100} alt="" />
              <div key={index} className='item-title'>
                <p className="event-date">{formatDate(event.created_at)}</p>
                <p className="event-name">{event.title}</p>
                <p className="event-attendees">{formatMembersCount(event.members_count)} people have joined this event</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NavBarLeft;