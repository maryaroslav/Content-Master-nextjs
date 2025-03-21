"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const publicRoutes = ["/", "/register", "/login"];

    useEffect(() => {
        if (status === "unauthenticated" && !publicRoutes.includes(pathname)) {
            router.push('/login');
        }
    }, [status, pathname, router]);

    if (status === 'loading') return <p>Loading...</p>

    return <>{children}</>;
}