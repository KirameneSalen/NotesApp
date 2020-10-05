import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonLoading, IonList
} from '@ionic/react';
import { add } from 'ionicons/icons';
import React, {useContext} from 'react';
import Note from './Note';
import { getLogger } from '../core';
import {RouteComponentProps} from "react-router";
import {NoteContext} from "./NoteProvider";

const log = getLogger('NotesList')

const NotesList: React.FC<RouteComponentProps> = ({ history }) => {
  const {notes, fetching, fetchingError} = useContext(NoteContext);
  log("NoteList render")
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Notes List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <IonLoading isOpen={fetching} message="Fetching notes" />
          {notes && (
              <IonList>
                  {notes.map(({ id, title, content}) =>
                      <Note key={id} id={id} title={title} content={content} onEdit={id => history.push(`/note/${id}`)}/>)}
              </IonList>
          )}
          {fetchingError && (
              <div>{fetchingError.message || 'Failed to fetch notes'}</div>
          )}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={() => history.push("/note")}>
                  <IonIcon icon={add} />
              </IonFabButton>
          </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default NotesList;
