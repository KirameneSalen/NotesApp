import axios from 'axios';
import { getLogger } from '../core';
import { NoteProps } from './NoteProps';

const log = getLogger('itemApi');

const baseUrl = 'http://localhost:3000';

export const getNotes: () => Promise<NoteProps[]> = () => {
    log('getNotes - started');
    return axios
        .get(`${baseUrl}/item`)
        .then(res => {
            log('getNotes - success');
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log('getNotes - fail');
            return Promise.reject(err);
        })
}