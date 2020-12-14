import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { AuthContext } from './AuthProvider';

interface LoginState {
    username?: string;
    password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({history}) => {
    const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
    const [state, setState] = useState<LoginState>({});
    const { username, password } = state;

    const handleLogin = () => {
        login?.(username, password);
    };

    if(isAuthenticated) {
        return <Redirect to={{pathname: '/'}}/>
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput
                    placeholder="Username"
                    value={username}
                    onIonChange={e => setState({
                        ...state,
                        username: e.detail.value || ''
                    })}
                />
                <IonInput
                    placeholder="Password"
                    value={password}
                    onIonChange={e => setState({
                        ...state,
                        password: e.detail.value || ''
                    })}
                />
                <IonLoading isOpen={isAuthenticating}/>
                {authenticationError && (
                    <div>{authenticationError || 'Failed to authenticate'}</div>
                )}
                <IonButton onClick={handleLogin}>Login</IonButton>
            </IonContent>
        </IonPage>
    );
};