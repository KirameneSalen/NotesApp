import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonLoading, IonList, IonSearchbar, IonToggle, IonLabel, IonItem, IonButton
} from '@ionic/react';
import {add} from 'ionicons/icons';
import React, {useContext, useState} from 'react';
import Note from './Note';
import { getLogger } from '../core';
import {Redirect, RouteComponentProps} from "react-router";
import {NoteContext} from "./NoteProvider";
import {AuthContext} from "../auth";

const log = getLogger('NotesList')

const NotesList: React.FC<RouteComponentProps> = ({ history }) => {
  const {notes, fetching, fetchingError} = useContext(NoteContext);
    const [searchNote, setSearchNote] = useState<string>('');
    const [toggleFavNote, setToggleFavNote] = useState<boolean>(false);
    const {token, logout} = useContext(AuthContext);
    const handleLogout = () => {
        logout?.();
        return <Redirect to={{pathname: "/login"}}/>;
    };
  log("render")
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Notes List</IonTitle>
            <IonButton class="ion-margin-end" onClick={handleLogout}>Logout</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <IonToolbar>
              <IonSearchbar
                  value={searchNote}
                  debounce={1000}
                  onIonChange={e => setSearchNote(e.detail.value!)}>
              </IonSearchbar>
              <IonItem>
                  <IonToggle checked={toggleFavNote} onIonChange={e => setToggleFavNote(e.detail.checked)} slot={"start"}/>
                  <IonLabel slot={"start"}>Toggle favorite</IonLabel>
              </IonItem>
          </IonToolbar>
          <IonLoading isOpen={fetching} message="Fetching notes" />
          {notes && (
              <IonList>
                  {notes
                      .filter(note => note.favorite === toggleFavNote)
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
