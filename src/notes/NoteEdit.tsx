import {getLogger} from "../core";
import {RouteComponentProps} from "react-router";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage, IonTextarea,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import React, {useContext, useEffect, useState} from "react";
import {NoteContext} from "./NoteProvider";
import {NoteProps} from "./NoteProps";

const log = getLogger('NoteEdit');

interface NoteEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const NoteEdit: React.FC<NoteEditProps> = ({ history, match }) => {
    const {notes, saving, savingError, saveNote} = useContext(NoteContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showSaveToast, setShowSaveToast] = useState(false);
    const [note, setNote] = useState<NoteProps>()
    useEffect(()=>{
        log('useEffect');
        const routeId = match.params.id || '';
        const note = notes?.find(n => String(n.id) === String(routeId));
        log(`useEffect ${typeof routeId}`);
        setNote(note);
        if(note){
            setTitle(note.title);
            setContent(note.content);
        }
    }, [match.params.id, notes]);

    const handleSave = () => {

        const editedNote = note ? { ...note, title, content } : { title, content };
        saveNote && saveNote(editedNote).then(() =>{
            setShowSaveToast(true);
            // history.goBack()
        });
    }

    const handleDelete = () => {
        // TODO implement delete
        history.goBack();
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
                    message="The note has been saved."
                    duration={200}
                />
            </IonContent>
        </IonPage>
    )
}

export default NoteEdit;