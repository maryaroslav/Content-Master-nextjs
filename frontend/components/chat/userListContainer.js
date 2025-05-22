import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/app/lib/apiClient";

const useFollowedUsers = (chat = []) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadFollowedUser = async () => {
            try {
                const data = await fetchWithAuth('http://localhost:5000/api/chat/following');
                setUsers(data);
            } catch (err) {
                console.error('Error loading follow: ', err);
            }
        };

        loadFollowedUser();
    }, [chat])

    return users;
}

export default useFollowedUsers;