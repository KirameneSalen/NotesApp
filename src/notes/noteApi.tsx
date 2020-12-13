import axios from 'axios';
import {AppConstants, authConfig, baseUrl, getLogger} from '../core';
import { NoteProps } from './NoteProps';
import {LocalStorage} from "../core/Storage";

const noteUrl = `http://${baseUrl}/api/note`;

const {v4: uuidv4} = require('uuid');

export const syncData: (token: string) => Promise<NoteProps[]> = async (token: string) => {
    const guitars = await getNotesLocal('D');
    return axios.post<NoteProps[]>(`${noteUrl}/sync`, guitars, authConfig(token))
        .then(
            response => response.data,
            () => {
                console.log('cannot sync data with server');
                return [];
            });
};

// export const getNotes: (token: string, isNetworkAvailable: boolean) => Promise<NoteProps[]> = (token, isNetworkAvailable) => {
//     return (isNetworkAvailable ? withLogs(axios.get(noteUrl, authConfig(token)), 'getNotes') : getNotesLocal());
// }

export const createNote: (token: string, note: NoteProps, isNetworkAvailable: boolean) => Promise<NoteProps> = (token, note, isNetworkAvailable) => {
    //return isNetworkAvailable ? withLogs(axios.post(noteUrl, note, authConfig(token)), 'createNote') : saveNoteLocal(note);
    if(isNetworkAvailable){
        console.log("API create sunt online frt")
        axios.post(noteUrl, note, authConfig(token)).then(
            response => {
                saveNoteLocal(response.data).then();
                return response.data;
            },
            () => saveNoteLocal(note)
        );
    }
    return saveNoteLocal(note);
}

export const updateNote: (token: string, note: NoteProps, isNetworkAvailable: boolean) => Promise<NoteProps> = (token, note, isNetworkAvailable) => {
    //return isNetworkAvailable ? withLogs(axios.put(`${noteUrl}/${note._id}`, note, authConfig(token)), 'updateNote') : saveNoteLocal(note);
    console.log(`API UPDATE NETWORK ${isNetworkAvailable}`)
    if(isNetworkAvailable){
        console.log("API update sunt online frt")
        axios.put(`${noteUrl}/${note._id}`, note, authConfig(token)).then(
            response => {
                saveNoteLocal(response.data).then();
                return response.data;
            },
            () => saveNoteLocal(note)
        );
    }
    return saveNoteLocal(note);
}

function setIfModifiedSinceHeader(notes: NoteProps[], config: any): void {
    if (notes.length === 0) return;
    let ifModifiedSince = new Date(notes[0].lastModified);
    notes.forEach(note => {
        const noteModified = new Date(note.lastModified);
        if (noteModified > ifModifiedSince) {
            ifModifiedSince = noteModified;
        }
    });
    const sec = ifModifiedSince.getSeconds();
    ifModifiedSince.setSeconds(sec + 1);
    config.headers['if-modified-since'] = ifModifiedSince.toUTCString();
}

export const getPagedNotes: (token: string,
                             page: number,
                             isNetworkAvailable: boolean,
                             filter?: boolean,
                             search?: string,) => Promise<NoteProps[]> =
    async (token: string, page: number, isNetworkAvailable: boolean, filter?: boolean, search?: string) => {
        if(isNetworkAvailable) {
            console.log(`API Network available`)
            let url = `${noteUrl}?page=${page}`;
            if (filter && filter) {
                url += '&filter=' + filter;
            }
            if (search && search !== '') {
                url += '&search=' + search;
            }
            const localNotes = await getNotesLocal()
                .then(notes => paginateAndMatch(notes, page, filter, search));
            console.log(`API ${localNotes}`);
            setIfModifiedSinceHeader(localNotes, authConfig(token));
            return axios.get<NoteProps[]>(url, authConfig(token)).then(
                response=>{
                    const notes = response.data;
                    console.log(`API RESPONSE ${notes}`)
                    notes.forEach(note=>{
                        const index = localNotes.findIndex(it => it._id === note._id);
                        if(index === -1){
                            localNotes.push(note)
                        }
                        else{
                            localNotes[index] = note;
                        }
                        LocalStorage.set(`${AppConstants.NOTES}/${note._id}`, note).then();
                    })
                    console.log(`API sunt gay si fac chestii`)
                    return localNotes;
                }
            ).catch(err => {
                if (err.response.status === 304) {
                    console.log('304');
                    return localNotes;
                }
                return getNotesLocal()
                    .then(notes => paginateAndMatch(notes, page, filter, search));
            })
            //return withLogs(axios.get(url, authConfig(token)), 'getPagedNotes')
        }
        return getNotesLocal().then(notes => paginateAndMatch(notes, page, filter, search));
    };

const PAGE_SIZE = 6;

function paginateAndMatch(notes: NoteProps[], page: number, filter?: boolean, search?: string): NoteProps[] {
    if (filter) {
        notes = notes.filter(notes => notes.favorite);
    }
    if (search) {
        notes = notes.filter(notes => notes.title.indexOf(search) >= 0 || notes.content.indexOf(search) >= 0);
    }
    notes.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    const resp: NoteProps[] = [];
    let i = 0;
    notes.forEach(guitar => {
        if (i >= PAGE_SIZE * page && i < PAGE_SIZE * (page + 1)) {
            resp.push(guitar);
        }
        i++;
    });
    return resp;
}

async function getNotesLocal(customPrefix?: string): Promise<NoteProps[]> {
    const keys: string[] = await LocalStorage.keys();
    const notes = [];
    for (const i in keys) {
        const key = keys[i];
        if (key.startsWith(AppConstants.NOTES)
            || (customPrefix && key.startsWith(`${customPrefix}/${AppConstants.NOTES}`))) {
            const note: NoteProps = await LocalStorage.get(key);
            notes.push(note);
        }
    }
    return notes;
}

function saveNoteLocal(note: NoteProps): Promise<NoteProps> {
    console.log("API salvam local frt")
    if (!note?._id) {
        note._id = uuidv4();
        note.version = 0;
    }
    LocalStorage.set(`${AppConstants.NOTES}/${note._id}`, note).then();
    return Promise.resolve(note);
}

interface MessageData {
    type: string;
    payload: NoteProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`)
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}