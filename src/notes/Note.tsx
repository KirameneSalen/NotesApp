import React from 'react'
import {IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle} from '@ionic/react'
import { NoteProps } from './NoteProps'

interface NotePropsExt extends NoteProps {
    onEdit: (_id?: string) => void;
}

const Note: React.FC<{note: NoteProps, onEdit: (_id?: string) => void}> = ({note, onEdit}) => {
    return (
        <IonCard button={true} onClick={() => onEdit(note._id)}>
            <IonCardHeader>
                <IonCardSubtitle>Last modified: {new Date(note.date).toDateString()}</IonCardSubtitle>
                <IonCardTitle>{note.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {note.content}
            </IonCardContent>
        </IonCard>
    )
}

export default Note;