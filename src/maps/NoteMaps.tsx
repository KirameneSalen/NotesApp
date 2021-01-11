import React, {useContext} from 'react';
import { MyMap } from './MyMap';
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/react";
import {NoteContext} from "../notes/NoteProvider";
import {useMyLocation} from "./useMyLocation";


const NoteMaps: React.FC = () => {
    const {notes} = useContext(NoteContext)
    useMyLocation();
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>All notes located</IonTitle>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">All notes</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {notes &&
                <MyMap
                    notes={notes}
                    onMapClick={log('onMap')}
                    onMarkerClick={log('onMarker')}
                />}
            </IonContent>
        </IonPage>
    );

    function log(source: string) {
        return (e: any) => console.log(source, e.latLng.lat(), e.latLng.lng());
    }
};

export default NoteMaps;