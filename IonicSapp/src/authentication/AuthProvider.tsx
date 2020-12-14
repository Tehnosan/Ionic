import React, {useCallback, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { login as loginApi } from './authenticationApi';

type LoginFn = (username?: string, password?: string) => void;

export interface AuthState {
    authenticationError: string | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFn;
    pendingAuthentication?: boolean;
    username?: string;
    password?: string;
    token: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    token: '',
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);
    const {isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token } = state;
    const login = useCallback<LoginFn>(loginCallback, []);

    useEffect(authenticationEffect, [pendingAuthentication]);

    const value = { isAuthenticated, login, isAuthenticating, authenticationError, token };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    function loginCallback(username?: string, password?: string): void {
        setState({
            ...state,
            pendingAuthentication: true,
            username,
            password
        });
    }

    function authenticationEffect() {
        let canceled = false;

        authenticate();

        return () => {
            canceled = true;
        }

        async function authenticate() {
            if(!pendingAuthentication) {
                console.info('authenticate, !pendingAuthentication, return');
                return;
            }

            try {
                console.info("authenticate...");
                setState({
                    ...state,
                    isAuthenticating: true,
                });

                const { username, password } = state;
                const { token } = await loginApi(username, password);

                if(canceled) {
                    return;
                }

                console.info("Authenticate succeeded");

                setState({
                    ...state,
                    token,
                    pendingAuthentication: false,
                    isAuthenticated: true,
                    isAuthenticating: false,
                });
            } catch (error) {
                console.warn("Sandri " + error.response.data.message);
                if(canceled) {
                    return;
                }

                console.info("Authenticate failed");

                setState({
                    ...state,
                    authenticationError: error.response.data.message,
                    pendingAuthentication: false,
                    isAuthenticating: false,
                });
            }
        }
    }
};