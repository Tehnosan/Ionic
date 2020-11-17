import React from "react";
import {RecipeProps} from "./RecipeProps";
import {IonItem, IonLabel} from "@ionic/react";

const Recipe: React.FC<RecipeProps> = ({id, name}) => {
    return (
        <IonItem>
            <IonLabel>{name}</IonLabel>
        </IonItem>
    );
};

export default Recipe;