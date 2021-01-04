import React, {useContext, useState} from "react";
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
import { add, wifi, warning } from "ionicons/icons";
import { RecipeContext } from "../components/RecipeProvider";
import {RecipeProps} from "../components/RecipeProps";
import {AuthContext} from "../authentication";
import {useNetwork} from "./useNetwork";
import {useAppState} from "./useAppState";

const RecipeList: React.FC<RouteComponentProps> = ({history}) => {
    const { recipes, fetching, fetchingError, searchNext, disableInfiniteScroll } = useContext(RecipeContext);
    const {logout} = useContext(AuthContext);
    const [searchRecipe, setSearchRecipe] = useState<string>('');
    const { appState } = useAppState();

    const handleLogout = () => {
        logout?.();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sandrino's app</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div>App state is {JSON.stringify(appState)}</div>
                <div>Network status is {JSON.stringify(useNetwork().networkStatus)}</div>
                <IonButton onClick={handleLogout}>Logout</IonButton>
                <IonSearchbar value={searchRecipe} debounce={500} onIonChange={e => setSearchRecipe(e.detail.value!)}/>
                <IonLoading isOpen={fetching} message="Fetching recipes" />
                {recipes && (
                    <IonList>
                        {recipes
                            .filter(({id, name, time, difficulty}) => name.indexOf(searchRecipe) >= 0)
                            .map(({ id, name}) =>
                            <Recipe key={id} id={id} name={name} time={""} difficulty={""} onEdit={id => history.push(`/recipe/${id}`)} />)}
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

                <IonFab vertical="top" horizontal="center" slot="fixed">
                    <IonFabButton disabled={true} color="primary">
                        <IonIcon icon={useNetwork().networkStatus.connected ? wifi : warning}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default RecipeList;
