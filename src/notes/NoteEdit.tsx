import {getLogger} from "../core";
import {RouteComponentProps} from "react-router";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent, IonFabButton,
    IonHeader, IonIcon,
    IonInput,
    IonLoading,
    IonPage, IonTextarea,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import React, {useContext, useEffect, useState} from "react";
import {NoteContext} from "./NoteProvider";
import {NoteProps} from "./NoteProps";
import {heart, heartOutline} from "ionicons/icons";
import {useNetwork} from "../core/useNetwork";

const log = getLogger('NoteEdit');

interface NoteEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const NoteEdit: React.FC<NoteEditProps> = ({ history, match }) => {
    const {notes, saving, savingError, saveNote} = useContext(NoteContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date());
    const [favorite, setFavorite] = useState(false);
    const [showSaveToast, setShowSaveToast] = useState(false);
    const [note, setNote] = useState<NoteProps>()
    const { networkStatus } = useNetwork();
    useEffect(()=>{
        //TODO: cleanup method
        log('useEffect');
        const routeId = match.params.id || '';
        const note = notes?.find(n => String(n._id) === String(routeId));
        setNote(note);
        if(note){
            setTitle(note.title);
            setContent(note.content);
            setFavorite(note.favorite);
            setDate(note.date);
        }
    }, [match.params.id, notes]);

    const handleSave = () => {
        const editedNote = note ? { ...note, title, content, date: new Date(), favorite } : { title, content, date: new Date(), favorite, media: "media" };
        saveNote && saveNote(editedNote).then(() =>{
            setShowSaveToast(true);
            //history.goBack()
        });
    }

    const handleDelete = () => {
        // TODO implement delete
        history.goBack();
    }

    const toggleFav = () => {
        setFavorite(!favorite)
    }

    const handleFav = () => {
        toggleFav()
    }

    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit Note</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>Save</IonButton>
                        <IonButton onClick={handleDelete}>Delete</IonButton>
                        <IonFabButton onClick={handleFav}>
                            <IonIcon icon={favorite ? heart : heartOutline} />
                        </IonFabButton>
                    </IonButtons>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput value={title} onIonChange={e => setTitle(e.detail.value || '')}/>
                <IonTextarea value={content} onIonChange={e => setContent(e.detail.value || '')}/>
                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
                <IonToast
                    position="bottom"
                    isOpen={showSaveToast}
                    onDidDismiss={() => setShowSaveToast(false)}
                    message={`${networkStatus.connected ? "Note was sent to the server." : "YOU ARE WORKING LOCALLY!!!"}`}
                    duration={2000}
                />
            </IonContent>
        </IonPage>
    )
}

export default NoteEdit;