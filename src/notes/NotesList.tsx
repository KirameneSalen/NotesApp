import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonLoading, IonList, IonSearchbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import React, {useContext, useState} from 'react';
import Note from './Note';
import { getLogger } from '../core';
import {RouteComponentProps} from "react-router";
import {NoteContext} from "./NoteProvider";

const log = getLogger('NotesList')

const NotesList: React.FC<RouteComponentProps> = ({ history }) => {
  const {notes, fetching, fetchingError} = useContext(NoteContext);
    const [searchNote, setSearchNote] = useState<string>('');
  log("render")
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Notes List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <IonSearchbar
              value={searchNote}
              debounce={1000}
              onIonChange={e => setSearchNote(e.detail.value!)}>
          </IonSearchbar>
          <IonLoading isOpen={fetching} message="Fetching notes" />
          {notes && (
              <IonList>
                  {notes
                      .filter(note => note.title.indexOf(searchNote) >= 0 || note.content.indexOf(searchNote) >= 0)
                      .map(({ _id, title, content, date, favorite}) =>
                      <Note key={_id} _id={_id} title={title} content={content} date={date} favorite={favorite} onEdit={id => history.push(`/note/${id}`)}/>)}
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
