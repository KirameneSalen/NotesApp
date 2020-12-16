import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {NoteContext} from "./NoteProvider";
import {NoteProps} from "./NoteProps";

const NoteConflict: React.FC<RouteComponentProps> = ({history}) => {
    const {conflictNotes, saving, savingError, saveNote} = useContext(NoteContext)
    const [firstNote, setFirstNote] = useState<NoteProps>();
    const [secondNote, setSecondNote] = useState<NoteProps>();
    useEffect(setNoteVs, []);

    function setNoteVs(){
        if(!conflictNotes || conflictNotes?.length === 0){
            history.goBack();
            return;
        }
        setFirstNote(conflictNotes[0]);
        setSecondNote(conflictNotes[1]);
    }

    const handleSave = (note: NoteProps) => {
        saveNote && saveNote(note).then(()=>{
            conflictNotes?.shift();
            conflictNotes?.shift();
            setNoteVs();
        });
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Version conflicts</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {firstNote && (<NoteConflictView note={firstNote} onAction={handleSave}/>)}
                <IonHeader>VS</IonHeader>
                {secondNote && (<NoteConflictView note={secondNote} onAction={handleSave}/>)}
                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
            </IonContent>
        </IonPage>
    );
}

export default NoteConflict;

export const NoteConflictView: React.FC<{note: NoteProps, onAction: (note: NoteProps) => void}> =
    ({note, onAction}) => {
    return(
        <IonCard>
            <IonCardHeader>
                <IonCardSubtitle>Last modified: {note.date}</IonCardSubtitle>
                <IonCardTitle>{note.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {note.content}
                <IonButton onClick={() => onAction(note)}>Accept this version</IonButton>
            </IonCardContent>
        </IonCard>
    );
    }