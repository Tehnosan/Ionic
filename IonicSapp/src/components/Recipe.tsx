import React from "react";
import {RecipeProps} from "./RecipeProps";
import {IonItem, IonLabel, IonRow} from "@ionic/react";

interface RecipePropertiesExtended extends RecipeProps{
    onEdit: (id?: string) => void;
}

const Recipe: React.FC<RecipePropertiesExtended> = ({id, name, onEdit}) => {
    return (
        <IonItem onClick={() => onEdit(id)}>
            <IonLabel>{name}</IonLabel>
        </IonItem>
    );
};

export default Recipe;