import { getSession } from "next-auth/react";

export const fetchWithAuth = async (url, options = {}) => {
    const session = await getSession();
    const token = session?.accessToken;

    if (!token) throw new Error('No session token');

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Api error')
    }
    return await res.json();
};