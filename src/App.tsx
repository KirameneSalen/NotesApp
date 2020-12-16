import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {IonApp, IonRouterOutlet} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {NoteEdit, NotesList} from "./notes";

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
import {AuthProvider, Login, PrivateRoute} from "./auth";
import NoteConflict from "./notes/NoteConflict";
import NoteMaps from "./maps/NoteMaps";

const App: React.FC = () => (
  <IonApp>
      <IonReactRouter>
          <IonRouterOutlet>
              <AuthProvider>
                  <Route path="/login" component={Login} exact={true}/>
                  <NoteProvider>
                      <PrivateRoute path="/notes" component={NotesList} exact={true}/>
                      <PrivateRoute path="/note" component={NoteEdit} exact={true}/>
                      <PrivateRoute path="/note/:id" component={NoteEdit} exact={true}/>
                      <PrivateRoute path="/notes/conflict" component={NoteConflict} exact={true}/>
                      <PrivateRoute path="/notes/map" component={NoteMaps} exact={true}/>
                  </NoteProvider>
                  <Route exact path="/" render={() => <Redirect to="/notes"/>}/>
              </AuthProvider>
          </IonRouterOutlet>
      </IonReactRouter>
  </IonApp>
);

export default App;
