import React from "react";
import {
    IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList, IonLoading, IonPage, IonTitle, IonToolbar
} from "@ionic/react";
import {useRecipes} from "../components/useRecipes";
import Recipe from "../components/Recipe";
import { add } from "ionicons/icons";

const RecipeList: React.FC = () => {
    const { recipes, fetching, fetchingError, addRecipe } = useRecipes();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching recipes" />
                {recipes && (
                    <IonList>
                        {recipes.map(({ id, name}) => <Recipe key={id} name={name} />)}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={addRecipe}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default RecipeList;