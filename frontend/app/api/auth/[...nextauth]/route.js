import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    const res = await fetch('http://localhost:5000/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(credentials)
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        console.error('Login failed:', errorData);
                        throw new Error(errorData.message || 'Invalid credentials');
                    }

                    const data = await res.json();
                    console.log('Login success:', data);

                    return { id: data.user.id, email: data.user.email, token: data.token };
                } catch (error) {
                    console.error('Login error:', error.message);
                    return null;
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
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.token = token.accessToken;
            }
            return session;
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    secret: process.env.NEXTAUTH_SECRET || 'supersecret'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
