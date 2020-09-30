import React from 'react'
import {IonCard, IonCardHeader, IonCardTitle, IonCardContent} from '@ionic/react'

interface ItemProps{
    id?: string,
    title: string,
    content: string,
    media?: string;
}

const Note: React.FC<ItemProps> = ({id, title, content, media}) => {
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