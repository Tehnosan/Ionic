import React, {useEffect, useState} from "react";
import {RecipeProps} from "./RecipeProps";
import {IonImg, IonItem, IonLabel, IonRow} from "@ionic/react";

interface RecipePropertiesExtended extends RecipeProps{
    onEdit: (id?: string) => void;
}

const Recipe: React.FC<RecipePropertiesExtended> = ({id, name, photoName, onEdit}) => {
    const [statePhotoName, setStatePhotoName] = useState("");

    function wrapper () {
        getWebPathFromPromise();
        async function getWebPathFromPromise() {
            const x = await photoName;

            setStatePhotoName(x!);
        }
    }


    useEffect(wrapper, []);

    return (
        <div>
            <IonItem onClick={() => onEdit(id)}>
                <IonLabel>{name}</IonLabel>
            </IonItem>
            <IonImg class="image" src={ statePhotoName }/>
        </div>
    );
};

export default Recipe;
