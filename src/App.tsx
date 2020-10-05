import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import NotesList from './notes/NotesList'
import NoteEdit from './notes/NoteEdit'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {NoteProvider} from "./notes/NoteProvider";

const App: React.FC = () => (
  <IonApp>
      <NoteProvider>
          <IonReactRouter>
              <IonRouterOutlet>
                  <Route path="/notes" component={NotesList} exact={true} />
                  <Route path="/note" component={NoteEdit} exact={true} />
                  <Route path="/note/:id" component={NoteEdit} exact={true} />
                  <Route exact path="/" render={() => <Redirect to="/notes" />} />
              </IonRouterOutlet>
          </IonReactRouter>
      </NoteProvider>
  </IonApp>
);

export default App;
