import axios from 'axios';
import { getLogger } from '../core';
import { NoteProps } from './NoteProps';

const log = getLogger('noteApi');

const baseUrl = 'http://localhost:8080';
const noteUrl = `${baseUrl}/note`;

interface ResponseProps<T> {
    data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T>{
     log(`${fnName} - started`);
     return promise
         .then(res => {
             log(`${fnName} - success`);
             return Promise.resolve(res.data);
         })
         .catch(err => {
             log(`${fnName} - failed`);
             return Promise.reject(err);
         })
}

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':  '*'
    }
}

// export const getNotes: () => Promise<NoteProps[]> = () => {
//     log('getNotes - started');
//     return axios
//         .get(`${baseUrl}/note`)
//         .then(res => {
//             log('getNotes - success');
//             return Promise.resolve(res.data);
//         })
//         .catch(err => {
//             log('getNotes - fail');
//             return Promise.reject(err);
//         })
// }

export const getNotes: () => Promise<NoteProps[]> = () => {
    return withLogs(axios.get(noteUrl, config), 'getNotes');
}

// export const findNoteById: (id: string) => Promise<NoteProps> = id => {
//     return withLogs(axios.get(`${noteUrl}/${id}`, config), 'findNoteById');
// }

export const createNote: (note: NoteProps) => Promise<NoteProps[]> = note => {
    return withLogs(axios.post(noteUrl, note, config), 'createNote');
}

export const updateNote: (note: NoteProps) => Promise<NoteProps[]> = note => {
    return withLogs(axios.put(`${noteUrl}/${note.id}`, note, config), 'updateNote');
}