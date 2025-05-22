import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
                twoFAToken: { label: '2FA Token', type: 'text' },
                userId: { label: 'UserId', type: 'text' },
            },
            async authorize(credentials) {
                const { email, password, twoFAToken, userId } = credentials;
                console.log('[NEXTAUTH] JWT_SECRET:', process.env.JWT_SECRET);
                try {
                    if (twoFAToken && userId) {
                        const res = await axios.post('http://localhost:5000/api/auth/2fa/verify-login', {
                            userId,
                            token: twoFAToken
                        });
                        const { token, user } = res.data;
                        user.token = token;
                        return user;
                    } else {
                        const res = await axios.post('http://localhost:5000/api/auth/login', {
                            email,
                            password
                        });
                        if (res.data.twofaRequired) {
                            const error = new Error('2FA Required');
                            error.name = 'TwoFA';
                            error.message = JSON.stringify({ twofaRequired: true, userId: res.data.userId });
                            throw error;
                        }
                        const { token, user } = res.data;
                        user.token = token;
                        return user;
                    }
                } catch (err) {
                    if (err.name === 'TwoFA') throw err;
                    throw new Error(err?.response?.data?.message || 'Login failed');
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email
            };
            session.accessToken = token.accessToken;
            return session;
        }
    },
    pages: {
        signIn: '/login'
    },
    secret: process.env.JWT_SECRET,
    debug: true
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
