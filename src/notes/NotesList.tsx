import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useState } from 'react';
import Note from './Note';
import { getLogger } from '../core';

const log = getLogger('ItemList')

const Home: React.FC = () => {
  const [items, setItems] = useState([
    {id: '1', title: "first try", content: "hi"},
    {id: '1', title: "it works", content: "yo"}
  ])
  const addItem = () => {
    const id = `${items.length + 1}`;
    log('ItemList addItem');
    setItems(items.concat({id, title: `Title ${id}`, content: `Content ${id}`}))
  }
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
