import HeaderMain from '@/components/headers/HeaderMain';
import NavBar from '@/components/NavBar';
import NavBarLeft from '@/components/sidebars/NavBarLeft';
import NavBarRight from '@/components/sidebars/NavBarRight';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

import '../../styles/main.css';

async function getUserCommunities() {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        throw new Error('Unauthorized');
    }

    const res = await fetch('http://localhost:5000/api/user/usercommunities', {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch communities.');
    }

    return res.json();  
}

export default async function MainLayout({ children }) {
    const communities = await getUserCommunities();

    return (
        <div className="page-layout">
            <HeaderMain />
            <NavBar />
            <div className="main-info-container">
                <NavBarLeft communities={communities} />
                {children}
                <NavBarRight />
            </div>
        </div>
    );
}
