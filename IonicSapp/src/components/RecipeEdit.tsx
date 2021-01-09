import React, {useContext, useEffect, useState} from "react";
import {
    IonButton,
    IonButtons,
    IonContent, IonFab, IonFabButton,
    IonHeader, IonIcon, IonImg,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {RecipeContext} from "./RecipeProvider";
import { RouteComponentProps } from "react-router";
import { RecipeProps } from "./RecipeProps";
import {camera} from "ionicons/icons";
import {Photo, usePhotoGallery} from "./usePhotoGallery";
import './image.css';
import {useMyLocation} from "./useMyLocation";
import {MyMap} from "./MyMap";

interface RecipeEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const RecipeEdit: React.FC<RecipeEditProps> = ({ history, match }) => {
    const { recipes, saving, savingError, saveRecipe } = useContext(RecipeContext);
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [latitude, setLatitude] = useState<number | undefined>(46.56862409846464);
    const [longitude, setLongitude] = useState<number | undefined>(26.892768939521332);
    const [recipe, setRecipe] = useState<RecipeProps>();

    const { photos, takePhoto, deletePhoto, currentPhotoWebPath, getPhotoByName, setCurrentPhotoWebPath, currentPhotoName, setCurrentPhotoName } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();

    const myLocation = useMyLocation();
    const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}

    useEffect(() => {
        console.info("Use EFect");
        const routeID = match.params.id || '';
        const local_recipe = recipes?.find(it => it.id == routeID);

        setRecipe(local_recipe);

        if(local_recipe){
            setName(local_recipe.name);
            setTime(local_recipe.time);
            setDifficulty(local_recipe.difficulty);

            if (typeof local_recipe.photoName === "string")
                setCurrentPhotoName(local_recipe.photoName);

            console.info("DDDDDDDDDD " + local_recipe.latitude + " " + lat + " " + latitude + " HHHHHHHHHHHHHHHHHH");
            setLatitude(local_recipe.latitude);
            setLongitude(local_recipe.longitude);
        }

        const webPath = async () => {
            if(local_recipe && local_recipe.photoName) {
                setCurrentPhotoWebPath(await getPhotoByName(local_recipe.photoName));
            }
        };
        webPath();

    }, [match.params.id, recipes]);

    const handleSave = () => {
        let newID = (-1).toString();
        const editedRecipe = recipe ? { ...recipe, name: name, time: time, difficulty: difficulty, photoName: currentPhotoName, latitude: latitude, longitude: longitude } : { id: newID, name: name, time: time, difficulty: difficulty, photoName: currentPhotoName, latitude: latitude, longitude: longitude };

        console.info(currentPhotoName + " GGGGGGGGGGGGGGG");
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
                <IonImg src={currentPhotoWebPath} class="image"/>

                <MyMap
                    lat={latitude}
                    lng={longitude}
                    onMapClick={log('onMap')}
                    onMarkerClick={log('onMarker')}
                />
                <p>{latitude + " aaaa"}</p>

                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save recipe'}</div>
                )}

                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={() => takePhoto()}>
                        <IonIcon icon={camera}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );

    function log(source: string) {
        return (l: any) => {
            console.log(source,l.latLng.lat(), l.latLng.lng());
            setLatitude(l.latLng.lat());
            setLongitude(l.latLng.lng());
            return l};
    }
};

export default RecipeEdit;
