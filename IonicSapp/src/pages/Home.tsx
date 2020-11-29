import React, {useContext} from "react";
import { RouteComponentProps } from "react-router";
import {
    IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList, IonLoading, IonPage, IonTitle, IonToolbar
} from "@ionic/react";
import Recipe from "../components/Recipe";
import { add } from "ionicons/icons";
import { RecipeContext } from "../components/RecipeProvider";

const RecipeList: React.FC<RouteComponentProps> = ({history}) => {
    const { recipes, fetching, fetchingError } = useContext(RecipeContext);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sandrino's app</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching recipes" />
                {recipes && (
                    <IonList>
                        {recipes.map(({ id, name}) =>
                            <Recipe key={id} id={id} name={name} time={""} difficulty={""} onEdit={id => history.push(`/recipe/${id}`)} />)}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
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