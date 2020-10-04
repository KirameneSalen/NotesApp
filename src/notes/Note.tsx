import React from 'react'
import {IonCard, IonCardHeader, IonCardTitle, IonCardContent} from '@ionic/react'
import { NoteProps } from './NoteProps'

const Note: React.FC<NoteProps> = ({id, title, content, media}) => {
    return (
        <IonCard>
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