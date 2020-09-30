import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import Note from './Note';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Notes List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Note title="first try" content="hi" />
        <Note title="it works" content="yo" />
      </IonContent>
    </IonPage>
  );
};

export default Home;
