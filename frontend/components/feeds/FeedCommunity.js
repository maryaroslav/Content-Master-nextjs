"use client";

import React, { useEffect, useState } from 'react';
import Modal from "../modals/createcommunity/Modal";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from '@/app/lib/apiClient';
import Image from 'next/image';
import '@/styles/feedCommunity.css'
import arrowDown from '@/public/img/icons/arrow-down.svg';

const FeedCommunity = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [myCommunities, setMyCommunities] = useState([]);
    const [userCommunities, setUserCommunities] = useState([]);
    const router = useRouter();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

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

    useEffect(() => {
        const loadMyCommunities = async () => {
            try {
                const data = await fetchWithAuth('http://localhost:5000/api/mycommunities');
                const communitiesUser = await fetchWithAuth('http://localhost:5000/api/user/usercommunities')
                setMyCommunities(data);
                setUserCommunities(communitiesUser);
            } catch (err) {
                console.error('Error loading communities: ', err);
            }
        };

        loadMyCommunities();
    }, []);

    return (
        <div className='feedcomunnity-grey'>
            <div className="feedcommunity-container">
                <div className='button-feedcommunity'>
                    <button onClick={() => setIsOpen(true)}>Create a community</button>
                </div>
                {myCommunities.length > 0 && (
                    <div className='feedcommunity-my-community-container'>
                        <h2 className='feedcomunity-section-title'>Created communities</h2>
                        <div className='feedcommunity-my-community-item'>
                            {myCommunities.map((community) => (
                                <div key={community.community_id} className="feedcommunity-item my-community-item">
                                    <Image src={`http://localhost:5000/uploads/communities_images/${community.photo}`} alt={community.name} width={100} height={100} />
                                    <div className="feedcommunity-item-title">
                                        <p className="feedcommunity-type my-community-type">{community.privacy}</p>
                                        <p className="feedcommunity-name my-community-name">{community.name}</p>
                                        <p className="feedcommunity-members my-community-members">{formatMembersCount(community.members_count)} Members</p>
                                    </div>
                                    <div className='feedcommunity-arrow'>
                                        <Image src={arrowDown} alt="" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {userCommunities.length > 0 && (
                    <div className='feedcommunity-my-community-container'>
                        <h2 className='feedcomunity-section-title'>My communities</h2>
                            {userCommunities.map((community) => (
                                <div key={community.community_id} className="feedcommunity-item">
                                    <Image src={`http://localhost:5000${community.photo}`} alt={community.name} width={100} height={100} />
                                    <div className="feedcommunity-item-title">
                                        <p className="feedcommunity-type">{community.privacy}</p>
                                        <p className="feedcommunity-name">{community.name}</p>
                                        <p className="feedcommunity-members">{formatMembersCount(community.members_count)} Members</p>
                                    </div>
                                    <div className='feedcommunity-arrow'>
                                        <Image src={arrowDown} alt="" />
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
                {isOpen &&
                    (<Modal closeModal={closeModal} />)
                }
            </div>
        </div>
    );
};

export default FeedCommunity;