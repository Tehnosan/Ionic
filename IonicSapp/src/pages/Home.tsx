import React, {useContext, useState} from "react";
import { RouteComponentProps } from "react-router";
import {
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
import {RecipeProps} from "../components/RecipeProps";

const RecipeList: React.FC<RouteComponentProps> = ({history}) => {
    const { recipes, fetching, fetchingError, searchNext, disableInfiniteScroll } = useContext(RecipeContext);
    const [searchRecipe, setSearchRecipe] = useState<string>('');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sandrino's app</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonLoading isOpen={fetching} message="Fetching recipes" />

                <IonSearchbar value={searchRecipe} debounce={500} onIonChange={e => setSearchRecipe(e.detail.value!)}></IonSearchbar>

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

            </IonContent>
        </IonPage>
    );
};

export default RecipeList;
