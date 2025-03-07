"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import '../styles/authForm.css';
import loginImg from '../img/login_1.png';
import registerImg from '../img/register_1.png';

// import { login } from '../reducers/authSlice'

const AuthForm = ({ type }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (type === 'login') {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            });
            if (result?.error) {
                setError(result.error)
            } else {
                router.push('/explore');
            }
        } else {
            try {
                const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, username })
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Failed to register');
                }

                await signIn('credentials', {
                    email,
                    password,
                    redirect: false
                });
                router.push('/explore');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="container-auth">
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h1>{type === 'login' ? 'Sign In to your account' : 'Create your account'}</h1>
                    {error && <p className='error-message'>{error}</p>}
                    <div className='input-email input-box'>
                        <p>Email</p>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className='input-password input-box'>
                        <p>Password</p>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    {type === 'register' && (
                        <div className='input-username input-box'>
                            <p>Username</p>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                            />
                        </div>
                    )}
                    <button className='btn-authForm' type="submit">{type === 'login' ? 'Sign In' : 'Sign Up'}</button>
                    {type === 'login' ? (
                        <div className='register'>
                            <p>Don’t have an account? <Link href="/register">Create account</Link></p>
                        </div>
                    ) : (
                        <div className='register'>
                            <p>Already have an account? <Link href="/login">Sign in</Link></p>
                        </div>
                    )}
                </form>
            </div>
            <div className='image'>
                {type === 'login' ? <Image src={loginImg} alt="login"></Image> : <Image src={registerImg} alt="register"></Image>}
            </div>
        </div>
    );
};

export default AuthForm;