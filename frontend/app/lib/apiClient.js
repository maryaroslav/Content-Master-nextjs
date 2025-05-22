import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const fetchWithAuth = async (url, options = {}) => {
    const session = await getSession();
    console.log("Session data222:", session);
    const token = session.accessToken;

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });

    console.log('Request sent to:', url);
    console.log('Request headers:', {
        ...options.headers,
        Authorization: `Bearer ${token}`
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error('API Error:', error);
        throw new Error(error.message || 'Api error')
    }
    return await res.json();
};