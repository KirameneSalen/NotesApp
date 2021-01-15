import {getLogger} from "../core";
import {RouteComponentProps} from "react-router";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent, IonFabButton,
    IonHeader, IonIcon,
    IonInput,
    IonLoading,
    IonPage, IonTextarea,
    IonTitle, IonToast,
    IonToolbar,
    createAnimation
} from "@ionic/react";
import React, {useContext, useEffect, useState} from "react";
import {NoteContext} from "./NoteProvider";
import {NoteProps} from "./NoteProps";
import {heart, heartOutline} from "ionicons/icons";
import {usePhotoGallery} from "../camera/usePhotoGallery";
import {useMyLocation} from "../maps/useMyLocation";
import {EditMap} from "../maps/EditMap";

const log = getLogger('NoteEdit');

interface NoteEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const NoteEdit: React.FC<NoteEditProps> = ({ history, match }) => {
    const {myLocation, updateMyPosition} = useMyLocation();
    const { lat: lat2, lng: lng2 } = myLocation || {}
    const {notes, saving, savingError, saveNote, networkStatus} = useContext(NoteContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date());
    const [favorite, setFavorite] = useState(false);
    const [showSaveToast, setShowSaveToast] = useState(false);
    const {takePhoto} = usePhotoGallery()
    const [photo, setPhoto] = useState('')
    const [note, setNote] = useState<NoteProps>()
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    useEffect(chainAnimations, []);
    useEffect(()=>{
        //TODO: cleanup method
        log('useEffect');
        const routeId = match.params.id || '';
        const note = notes?.find(n => String(n._id) === String(routeId));
        setNote(note);
        if(note){
            setTitle(note.title);
            setContent(note.content);
            setFavorite(note.favorite);
            setDate(note.date);
            setPhoto(note.media);
            setLat(note.lat);
            setLng(note.lng);
            updateMyPosition('current', note.lat, note.lng);
        }
    }, [match.params.id, notes]);

    useEffect(simpleAnimation, [photo]);

    const handleSave = () => {
        const editedNote = note ?
            { ...note, title, content, date: new Date(), favorite, media: photo, lat, lng } :
            { title, content, date: new Date(), favorite, media: photo, version: 0, lastModified: new Date(), lat, lng };
        saveNote && saveNote(editedNote).then(() =>{
            setShowSaveToast(true);
            //history.goBack()
        });
    }

    function handleMapOnClick() {
        return (e: any) => {
            updateMyPosition('current', e.latLng.lat(), e.latLng.lng());
            setLat(e.latLng.lat());
            setLng(e.latLng.lng());
        }
    }

    async function handlePhotoChange() {
        const image = await takePhoto();
        if (!image) {
            setPhoto('');
        } else {
            setPhoto(image);
        }
    }

    const handleDelete = () => {
        // TODO implement delete
        history.goBack();
    }

    const toggleFav = () => {
        setFavorite(!favorite)
    }

    const handleFav = () => {
        toggleFav()
    }

    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit Note</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>Save</IonButton>
                        <IonButton onClick={handleDelete}>Delete</IonButton>
                        <IonFabButton onClick={handleFav}>
                            <IonIcon icon={favorite ? heart : heartOutline} />
                        </IonFabButton>
                    </IonButtons>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="title"><IonInput value={title} onIonChange={e => setTitle(e.detail.value || '')}/></div>
                <div className="content"><IonTextarea value={content} onIonChange={e => setContent(e.detail.value || '')}/></div>
                {photo && (<img className="img" onClick={handlePhotoChange} src={photo} height={'100px'}/>)}
                {!photo && (<div><img className={"img-none"} onClick={handlePhotoChange} src={'https://static.thenounproject.com/png/187803-200.png'} height={'100px'}/><p>PAPA</p></div>)}
                {log(lat2, lng2)}
                {

                    <EditMap
                    lat={lat2}
                    lng={lng2}
                    onMapClick={handleMapOnClick()}
                    />
                }
                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
                <IonToast
                    position="bottom"
                    isOpen={showSaveToast}
                    onDidDismiss={() => setShowSaveToast(false)}
                    message={`${networkStatus ? "Note was sent to the server." : "YOU ARE WORKING LOCALLY!!!"}`}
                    duration={2000}
                />
            </IonContent>
        </IonPage>
    )

    function simpleAnimation() {
        const el = document.querySelector('.img');
        log("WEHIWUHEIWFHWIUFEH", el)
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {
                        offset: 0, transform: 'translateX(0px)', opacity: '1'
                    },
                    {
                        offset: 1, transform: 'translateX(100px)', opacity: '0.5'
                    }
                ]);
            animation.play();
        }
    }

    function chainAnimations() {
        const elB = document.querySelector('.title');
        const elC = document.querySelector('.content');
        if (elB && elC) {
            const animationA = createAnimation()
                .addElement(elB)
                .duration(1000)
                .fromTo('transform', 'translateX(0px)', 'translateX(200px)');
            const animationB = createAnimation()
                .addElement(elC)
                .duration(1000)
                .fromTo('transform', 'translateX(0px)', 'translateX(200px)');
            (async () => {
                await animationA.play();
                await animationB.play();
            })();
        }
    }
}

export default NoteEdit;