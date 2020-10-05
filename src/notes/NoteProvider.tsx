import React, { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { NoteProps } from './NoteProps';
import { createNote, getNotes, updateNote } from './noteApi';

const log = getLogger('NoteProvider');

type SaveNoteFn = (note: NoteProps) => Promise<any>;

export interface NotesState {
    notes?: NoteProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveNote?: SaveNoteFn,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: NotesState = {
    fetching: false,
    saving: false,
};

const FETCH_NOTES_STARTED = 'FETCH_NOTES_STARTED';
const FETCH_NOTES_SUCCEEDED = 'FETCH_NOTES_SUCCEEDED';
const FETCH_NOTES_FAILED = 'FETCH_NOTES_FAILED';
const SAVE_NOTE_STARTED = 'SAVE_NOTE_STARTED';
const SAVE_NOTE_SUCCEEDED = 'SAVE_NOTE_SUCCEEDED';
const SAVE_NOTE_FAILED = 'SAVE_NOTE_FAILED';

const reducer: (state: NotesState, action: ActionProps) => NotesState =
    (state, { type, payload }) => {
        switch(type) {
            case FETCH_NOTES_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_NOTES_SUCCEEDED:
                return { ...state, notes: payload.notes, fetching: false };
            case FETCH_NOTES_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };
            case SAVE_NOTE_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_NOTE_SUCCEEDED:
                const notes = [...(state.notes || [])];
                const note = payload.note;
                const index = notes.findIndex(n => n.id === note.id);
                if (index === -1) {
                    notes.splice(0, 0, note);
                } else {
                    notes[index] = note;
                }
                return { ...state,  notes, saving: false };
            case SAVE_NOTE_FAILED:
                return { ...state, savingError: payload.error, saving: false };
            default:
                return state;
        }
    };

export const NoteContext = React.createContext<NotesState>(initialState);

interface NoteProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { notes, fetching, fetchingError, saving, savingError } = state;
    log("NoteProvider");
    useEffect(getNotesEffect, []);
    const saveNote = useCallback<SaveNoteFn>(saveNoteCallback, []);
    const value = { notes, fetching, fetchingError, saving, savingError, saveNote };
    log('returns');
    return (
        <NoteContext.Provider value={value}>
            {children}
        </NoteContext.Provider>
    );

    function getNotesEffect() {
        let canceled = false;
        fetchNotes();
        return () => {
            canceled = true;
        }

        async function fetchNotes() {
            try {
                log('fetchNotes started');
                dispatch({ type: FETCH_NOTES_STARTED });
                const notes = await getNotes();
                log('fetchNotes succeeded');
                if (!canceled) {
                    dispatch({ type: FETCH_NOTES_SUCCEEDED, payload: { notes } });
                }
            } catch (error) {
                log('fetchNotes failed');
                dispatch({ type: FETCH_NOTES_FAILED, payload: { error } });
            }
        }
    }

    async function saveNoteCallback(note: NoteProps) {
        try {
            log('saveNote started');
            dispatch({ type: SAVE_NOTE_STARTED });
            const savedNote = await (note.id ? updateNote(note) : createNote(note));
            log('saveNote succeeded');
            dispatch({ type: SAVE_NOTE_SUCCEEDED, payload: { note: savedNote } });
        } catch (error) {
            log('saveNote failed');
            dispatch({ type: SAVE_NOTE_FAILED, payload: { error } });
        }
    }
};
