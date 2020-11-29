import axios from 'axios';
import {authConfig, baseUrl, getLogger, withLogs} from '../core';
import { NoteProps } from './NoteProps';

const noteUrl = `http://${baseUrl}/api/note`;

export const getNotes: (token: string) => Promise<NoteProps[]> = token => {
    return withLogs(axios.get(noteUrl, authConfig(token)), 'getNotes');
}

export const createNote: (token: string, note: NoteProps) => Promise<NoteProps[]> = (token, note) => {
    return withLogs(axios.post(noteUrl, note, authConfig(token)), 'createNote');
}

export const updateNote: (token: string, note: NoteProps) => Promise<NoteProps[]> = (token, note) => {
    return withLogs(axios.put(`${noteUrl}/${note._id}`, note, authConfig(token)), 'updateNote');
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