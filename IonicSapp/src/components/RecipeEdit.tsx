import React, {useContext, useEffect, useState} from "react";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {RecipeContext} from "./RecipeProvider";
import { RouteComponentProps } from "react-router";
import { RecipeProps } from "./RecipeProps";

interface RecipeEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const RecipeEdit: React.FC<RecipeEditProps> = ({ history, match }) => {
    const { recipes, saving, savingError, saveRecipe } = useContext(RecipeContext);
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [recipe, setRecipe] = useState<RecipeProps>();

    useEffect(() => {
        const routeID = match.params.id || '';
        const local_recipe = recipes?.find(it => it.id == routeID);

        setRecipe(local_recipe);

        if(local_recipe){
            setName(local_recipe.name);
            setTime(local_recipe.time);
            setDifficulty(local_recipe.difficulty);
        }
    }, [match.params.id, recipes]);

    const handleSave = () => {
        let newID;
        if(recipes?.length){
            newID = (-1).toString();
        }
        const editedRecipe = recipe ? { ...recipe, name: name, time: time, difficulty: difficulty} : { id: newID, name: name, time: time, difficulty: difficulty };

        saveRecipe && saveRecipe(editedRecipe, recipes || []).then(() => history.goBack());
    };

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>

                    <IonButtons slot="end">
                        <IonButton onClick={handleSave} >Save Recipe</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonInput value={name} onIonChange={e => setName(e.detail.value || '')} placeholder={"Name"} />
                <IonInput value={time} onIonChange={e => setTime(e.detail.value || '')} placeholder={"Time"} />
                <IonInput value={difficulty} onIonChange={e => setDifficulty(e.detail.value || '')} placeholder={"Difficulty"} />

                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save recipe'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default RecipeEdit;
