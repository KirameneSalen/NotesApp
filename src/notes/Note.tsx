import React from 'react'
import {IonCard, IonCardHeader, IonCardTitle, IonCardContent} from '@ionic/react'
import { NoteProps } from './NoteProps'

interface NotePropsExt extends NoteProps {
    onEdit: (id?: string) => void;
}

const Note: React.FC<NotePropsExt> = ({id, title, content, media, onEdit}) => {
    return (
        <IonCard button={true} onClick={() => onEdit(id)}>
            <IonCardHeader>
                <IonCardTitle>{title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {content}
            </IonCardContent>
        </IonCard>
    )
}

export default Note;