import React, {useContext, useEffect, useState} from "react";
import { RouteComponentProps } from "react-router";
import {
    IonButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonInfiniteScroll, IonInfiniteScrollContent,
    IonList,
    IonLoading,
    IonPage, IonSearchbar,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import Recipe from "../components/Recipe";
import { add } from "ionicons/icons";
import { RecipeContext } from "../components/RecipeProvider";
import {AuthContext} from "../authentication";
import {useNetwork} from "./useNetwork";
import {useAppState} from "./useAppState";
import {usePhotoGallery} from "../components/usePhotoGallery";
import {chainAnimations, titleAnimation } from "../authentication/Animations";
import "./Home.css";

const RecipeList: React.FC<RouteComponentProps> = ({history}) => {
    const { recipes, fetching, fetchingError, searchNext, disableInfiniteScroll } = useContext(RecipeContext);
    const {logout} = useContext(AuthContext);
    const [searchRecipe, setSearchRecipe] = useState<string>('');

    const { getPhotoByName } = usePhotoGallery();

    const { appState } = useAppState();
    const { networkStatus } = useNetwork();

    const handleLogout = () => {
        logout?.();
    }

    useEffect(titleAnimation, []);
    useEffect(chainAnimations, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <div className="container2">
                        <div className="title">
                            <IonTitle>Sandrino's app</IonTitle>
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {/*<div>App state is {JSON.stringify(appState)}</div>*/}
                <div className="container3">
                    <div className="status">
                        <p className="text">Network status is {JSON.stringify(!disableInfiniteScroll)}</p>
                    </div>
                    <div className="button">
                        <IonButton onClick={handleLogout}>Logout</IonButton>
                    </div>
                </div>

                <IonSearchbar value={searchRecipe} debounce={500} onIonChange={e => setSearchRecipe(e.detail.value!)}/>
                <IonLoading isOpen={fetching} message="Fetching recipes" />
                {recipes && (
                    <IonList>
                        {recipes
                            .filter(({ name}) => name.indexOf(searchRecipe) >= 0)
                            .map(({ id, name, photoName}, position) =>
                            <div key={id}>
                                <Recipe id={id} name={name} time={""} difficulty={""} onEdit={id => history.push(`/recipe/${id}`)}  photoName={ getPhotoByName(photoName!) }/>
                            </div>)}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}

                <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                                   onIonInfinite={(e: CustomEvent<void>) => searchNext?.(e, recipes)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more recipes...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push(`/recipe`)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default RecipeList;
