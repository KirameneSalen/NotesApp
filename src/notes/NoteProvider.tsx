import React, {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { NoteProps } from './NoteProps';
import {createNote, getPagedNotes, newWebSocket, updateNote} from './noteApi';
import {AuthContext} from "../auth";
import {NetworkStatus, Plugins} from "@capacitor/core";

const { Network } = Plugins;

const log = getLogger('NoteProvider');

type SaveNoteFn = (note: NoteProps) => Promise<any>;

export interface NotesState {
    notes?: NoteProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveNote?: SaveNoteFn,
    page: number
    setPage?: Function,
    scrollDisabled: boolean,
    searchNote: string,
    setSearchNote?: Function,
    toggleFavNote: boolean,
    setToggleFavNote?: Function,
    networkStatus: boolean
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: NotesState = {
    fetching: false,
    saving: false,
    page: 0,
    scrollDisabled: false,
    searchNote: '',
    toggleFavNote: false,
    networkStatus: false,
};

const FETCH_NOTES_STARTED = 'FETCH_NOTES_STARTED';
const FETCH_NOTES_SUCCEEDED = 'FETCH_NOTES_SUCCEEDED';
const FETCH_NOTES_FAILED = 'FETCH_NOTES_FAILED';
const SAVE_NOTE_STARTED = 'SAVE_NOTE_STARTED';
const SAVE_NOTE_SUCCEEDED = 'SAVE_NOTE_SUCCEEDED';
const SAVE_NOTE_FAILED = 'SAVE_NOTE_FAILED';
const RESET_NOTE = 'RESET_NOTE'

const reducer: (state: NotesState, action: ActionProps) => NotesState =
    (state, { type, payload }) => {
        switch(type) {
            case FETCH_NOTES_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_NOTES_SUCCEEDED:
                let n = state.notes || []
                payload.notes
                    .forEach((item: NoteProps) => {
                        const index = n.findIndex((it: NoteProps) => it._id === item._id);
                        if (index === -1) {
                            n.push(item);
                        } else {
                            n[index] = item;
                        }
                    });
                console.log(`PAYLOAD BITCH ${payload.notes}`)
                return { ...state, notes: n, fetching: false };
            case FETCH_NOTES_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };
            case SAVE_NOTE_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_NOTE_SUCCEEDED:
                const notes = [...(state.notes || [])];
                const note = payload.note;
                const index = notes.findIndex(n => n._id === note._id);
                if (index === -1) {
                    notes.splice(0, 0, note);
                } else {
                    notes[index] = note;
                }
                return { ...state,  notes, saving: false };
            case SAVE_NOTE_FAILED:
                return { ...state, savingError: payload.error, saving: false };
            case RESET_NOTE:
                return {...state, notes: []}
            default:
                return state;
        }
    };

export const NoteContext = React.createContext<NotesState>(initialState);

interface NoteProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
    // const { networkStatus } = useNetwork();
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { notes, fetching, fetchingError, saving, savingError } = state;
    const [page, setPage] = useState<number>(0);
    const [scrollDisabled, setScrollDisabled] = useState<boolean>(false)
    const [networkStatus, setNetworkStatus] = useState(false)
    const [searchNote, setSearchNote] = useState<string>('');
    const [toggleFavNote, setToggleFavNote] = useState<boolean>(false);
    useEffect(networkEffect(), [])
    useEffect(getNotesEffect, [token, page, searchNote, toggleFavNote, networkStatus]);
    useEffect(resetNotes, [token, searchNote, toggleFavNote])
    useEffect(wsEffect, [token, networkStatus]);
    const saveNote = useCallback<SaveNoteFn>(saveNoteCallback, [token, page]);
    const value = { notes, fetching, fetchingError, page, searchNote, setSearchNote, setToggleFavNote, toggleFavNote, setPage, scrollDisabled, saving, savingError, saveNote, networkStatus};
    log('returns');
    return (
        <NoteContext.Provider value={value}>
            {children}
        </NoteContext.Provider>
    );

    function networkEffect() {
        const handler = Network.addListener('networkStatusChange', handleNetworkStatusChange);
        Network.getStatus().then(handleNetworkStatusChange);
        let canceled = false;
        return () => {
            canceled = true;
            handler.remove();
        }

        function handleNetworkStatusChange(status: NetworkStatus) {
            console.log('useNetwork - status change', status);
            if (!canceled) {
                setNetworkStatus(status.connected);
            }
        }
    }

    function getNotesEffect() {
        let canceled = false;
        fetchNotes().then();
        return () => {
            canceled = true;
        }

        async function fetchNotes() {
            if (!token?.trim()) {
                return;
            }
            try {
                log('fetchNotes started');
                dispatch({ type: FETCH_NOTES_STARTED });
                const notes =  await getPagedNotes(token, page, networkStatus, toggleFavNote, searchNote);
                log(notes)
                log('fetchNotes succeeded');
                setScrollDisabled(false)
                if (!canceled) {
                    dispatch({ type: FETCH_NOTES_SUCCEEDED, payload: { notes } });
                }
            } catch (error) {
                log('fetchNotes failed');
                setScrollDisabled(true)
                dispatch({ type: FETCH_NOTES_FAILED, payload: { error } });
            }
        }
    }

    function resetNotes(){
        setPage(0)
        dispatch({type: RESET_NOTE})
    }

    async function saveNoteCallback(note: NoteProps) {
        try {
            log('saveNote started');
            dispatch({ type: SAVE_NOTE_STARTED });
            const savedNote = await (note._id ? updateNote(token, note, networkStatus) : createNote(token, note, networkStatus));
            log('saveNote succeeded');
            dispatch({ type: SAVE_NOTE_SUCCEEDED, payload: { note: savedNote } });
        } catch (error) {
            log('saveNote failed');
            dispatch({ type: SAVE_NOTE_FAILED, payload: { error } });
        }
    }

    function wsEffect() {
        if (!networkStatus || token === '') {
            return;
        }
        let canceled = false;
        log('wsEffect - connecting');
        let closeWebSocket: () => void;
        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if (canceled) {
                    return;
                }
                const {type, payload: note} = message;
                log(`ws message, item ${type}`);
                if (type === 'created' || type === 'updated') {
                    dispatch({type: SAVE_NOTE_SUCCEEDED, payload: {note}});
                }
            });
        }
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
};
