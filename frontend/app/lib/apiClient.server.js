import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function getAccessTokenOrRedirect() {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        redirect('/login')
    }

    return session.accessToken;
}