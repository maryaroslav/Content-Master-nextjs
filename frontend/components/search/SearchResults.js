'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchWithAuth } from '@/app/lib/apiClient';
import arrowDown from '@/public/img/icons/arrow-down.svg';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/feedCommunity.css';
import '@/styles/searchResults.css';

export default function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [users, setUsers] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [filter, setFilter] = useState('all');
    console.log(users);
    console.log(communities);

    useEffect(() => {
        if (query) {
            fetchWithAuth(`http://localhost:5000/api/search?q=${query}`).then((res) => {
                setUsers(res.users);
                setCommunities(res.communities);
            });
        }
    }, [query]);

    const formatMembersCount = (count) => {
        if (count >= 1_000_000) {
            return `${(count / 1_000_000).toFixed(count % 1_000_000 === 0 ? 0 : 1)}kk`;
        }
        if (count >= 1_000) {
            return `${(count / 1_000).toFixed(count % 1_000 === 0 ? 0 : 1)}k`;
        }
        return count;
    };

    return (
        <div style={{ marginTop: '43px', padding: '20px', borderRadius: '10px', backgroundColor: '#fafafa'}}>
            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Search results for "{query}"</h1>
            <div className='search-buttons-container' style={{ marginBottom: '15px' }}>
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('users')}>Users</button>
                <button onClick={() => setFilter('communities')}>Communities</button>
            </div>

            {filter !== 'communities' && users.map(u => (
                <Link key={u.user_id} href={`/profile/${u.username}`}>
                    <div className='feedcommunity-my-community-container'>
                        <div className="feedcommunity-item">
                            {u.profile_picture ? (
                                <Image src={`http://localhost:5000/uploads/${u.profile_picture}`} alt={u.username} width={100} height={100} style={{ borderRadius: '50%' }} />
                            ) : (
                                <Image src="/img/icons/user.svg" alt="default" width={100} height={100} style={{ borderRadius: '50%' }} />
                            )}
                            <div className="feedcommunity-item-title">
                                <p className="feedcommunity-type">USER</p>
                                <p className="feedcommunity-name">{u.username}</p>
                                <p className="feedcommunity-members">{u.bio}</p>
                            </div>
                            <div className='feedcommunity-arrow'>
                                <Image src={arrowDown} alt="" />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}

            {filter !== 'users' && communities.map(c => (
                <Link key={c.community_id} href={`/community/${c.community_id}`}>
                    <div className='feedcommunity-my-community-container'>
                        <div className="feedcommunity-item">
                            <Image src={`http://localhost:5000${c.photo}`} alt={c.name} width={100} height={100} />
                            <div className="feedcommunity-item-title">
                                <p className="feedcommunity-type">{c.privacy}</p>
                                <p className="feedcommunity-name">{c.name}</p>
                                <p className="feedcommunity-members">{formatMembersCount(c.members_count)} Members</p>
                            </div>
                            <div className='feedcommunity-arrow'>
                                <Image src={arrowDown} alt="" />
                            </div>
                        </div>
                    </div>
                </Link>

            ))}
        </div>
    );
}
