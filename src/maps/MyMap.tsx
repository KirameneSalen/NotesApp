import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { mapsApiKey } from './mapsApiKey';
import {NoteProps} from "../notes/NoteProps";

interface MyMapProps {
    notes?: NoteProps[],
    lat: number,
    lng: number,
    onMapClick: (e: any) => void,
    onMarkerClick: (e: any) => void,
}

export const MyMap =
    compose<MyMapProps, any>(
        withProps({
            googleMapURL:
                `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&v=3.exp&libraries=geometry,drawing,places`,
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: `400px` }} />,
            mapElement: <div style={{ height: `100%` }} />
        }),
        withScriptjs,
        withGoogleMap
    )(props => (
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: 37.78825, lng: -122.4324 }}
            onClick={props.onMapClick}
        >
            {props.notes?.map(
                note =>
                    <Marker
                        key={note._id}
                        position={{ lat: note.lat, lng: note.lng }}
                        onClick={props.onMarkerClick}
                        label={note.title}
                    />
            )}
        </GoogleMap>
    ))

