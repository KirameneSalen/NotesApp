import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonLoading,
    IonList,
    IonSearchbar,
    IonToggle,
    IonLabel,
    IonItem,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent
} from '@ionic/react';
import {add} from 'ionicons/icons';
import React, {useContext, useEffect} from 'react';
import Note from './Note';
import { getLogger } from '../core';
import {Redirect, RouteComponentProps} from "react-router";
import {NoteContext} from "./NoteProvider";
import {AuthContext} from "../auth";
import {ModalMap} from "../maps/ModalMap";

const log = getLogger('NotesList')

const NotesList: React.FC<RouteComponentProps> = ({ history }) => {
    const {notes, fetching, fetchingError, page, setPage, scrollDisabled, searchNote, setSearchNote, toggleFavNote, setToggleFavNote, networkStatus, conflictNotes} = useContext(NoteContext);
    const {logout} = useContext(AuthContext)
    const noop = () => {
    }
    const handleLogout = () => {
        logout?.();
        return <Redirect to={{pathname: "/login"}}/>;
    };

    const handleOpenMap = () => {
        history.push('/notes/map');
    }
    log("render")
    log(`PAGE: ${page}`)
    async function getNewNotes($event: CustomEvent<void>){
        log('scrolling to page: ', page)
        setPage ? setPage(page+1) : noop();
        ($event.target as HTMLIonInfiniteScrollElement).complete().then();
    }

    useEffect(conflictNotesEffect, [conflictNotes]);

    function conflictNotesEffect() {
        if(conflictNotes && conflictNotes.length > 0) {
            console.log('conflictGuitars', conflictNotes);
            history.push('/notes/conflict');
        }
    }
    log(`SCROLL DISABLED: ${scrollDisabled}`);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My Notes List - {networkStatus ? "online" : "offline"}</IonTitle>
                    <ModalMap/>
                    {/*<IonButton onClick={handleOpenMap}>Open map</IonButton>*/}
                    <IonButton slot="end" onClick={handleLogout}>Logout</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonToolbar>
                    <IonSearchbar
                        value={searchNote}
                        debounce={1000}
                        onIonChange={e => setSearchNote && setPage ? setSearchNote(e.detail.value!) && setPage(0) : noop()}>
                    </IonSearchbar>
                    <IonItem>
                        <IonToggle checked={toggleFavNote} onIonChange={e => setToggleFavNote && setPage ? setToggleFavNote(e.detail.checked) && setPage(0) : noop()} slot={"start"}/>
                        <IonLabel slot={"start"}>Toggle favorite</IonLabel>
                    </IonItem>
                </IonToolbar>
                <IonLoading isOpen={fetching} message="Fetching notes" />
                {notes && (
                    <IonList>
                        {log(toggleFavNote, searchNote)}
                        {notes
                            //.filter(note => toggleFavNote ? note.favorite === toggleFavNote : true)
                            //.filter(note => searchNote!= '' ? note.title.indexOf(searchNote) >= 0 || note.content.indexOf(searchNote) >= 0 : true)
                            .map(note =>
                                <Note key={note._id} note={note} onEdit={id => history.push(`/note/${id}`)}/>)}
                    </IonList>
                )}
                <IonInfiniteScroll threshold="100px" disabled={scrollDisabled}
                                   onIonInfinite={(e: CustomEvent<void>) => getNewNotes(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
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
