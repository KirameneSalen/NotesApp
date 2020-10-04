import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import React from 'react';
import Note from './Note';
import { getLogger } from '../core';
import { useNotes } from './useNotes'

const log = getLogger('ItemsList')

const Home: React.FC = () => {
  const {items, addItem} = useNotes();
  log("ItemList render")
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Notes List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {items.map(({ id, title, content}) => <Note key={id} title={title} content={content} />)}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={addItem}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
