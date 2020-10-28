import React from 'react'
import {IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle} from '@ionic/react'
import { NoteProps } from './NoteProps'

interface NotePropsExt extends NoteProps {
    onEdit: (id?: string) => void;
}

const Note: React.FC<NotePropsExt> = ({id, title, content, media, date, favorite, size, onEdit}) => {
    return (
        <IonCard button={true} onClick={() => onEdit(id)}>
            <IonCardHeader>
                <IonCardSubtitle>Last modified: {new Date(date).toDateString()}</IonCardSubtitle>
                <IonCardTitle>{title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {content}
            </IonCardContent>
        </IonCard>
    )
}

export default Note;