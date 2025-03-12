"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import store from './lib/store';

export default function Providers({ children, session }) {
    return (
        <SessionProvider session={session}>
            <Provider store={store}>
                {children}
            </Provider>
        </SessionProvider>
    );
}