import { getSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
    const socketRef = useRef(null);

    useEffect(() => {
        const connectSocket = async () => {
            const session = await getSession();
            if(!session?.accessToken) return;

            const socket = io('http://localhost:5000', {
                auth: {
                    token: `Bearer ${session.accessToken}`
                }
            });
            socketRef.current = socket
        };
        connectSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        }
    }, []);

    return socketRef;
}

export default useSocket;